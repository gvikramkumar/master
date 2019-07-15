import {inject, injectable, LazyServiceIdentifer} from 'inversify';
import SubmeasureRepo from './repo';
import {ApiError} from '../../../lib/common/api-error';
import SubmeasurePgRepo from './pgrepo';
import InputLevelPgRepo, {SubmeasureInputLvl} from './input-level-pgrepo';
import _ from 'lodash';
import {filterLevelMap} from '../../../../shared/models/filter-level-map';
import ApprovalController from '../../../lib/base-classes/approval-controller';
import {ApprovalMode, BusinessUploadFileType, Directory} from '../../../../shared/misc/enums';
import LookupRepo from '../../lookup/repo';
import {shUtil} from '../../../../shared/misc/shared-util';
import ProductClassUploadRepo from '../../prof/product-class-upload/repo';
import DeptUploadRepo from '../../prof/dept-upload/repo';
import FileRepo from '../../file/repo';
import {mgc} from '../../../lib/database/mongoose-conn';
import DeptUploadImport from '../../prof/upload/dept/import';
import {svrUtil} from '../../../lib/common/svr-util';
import xlsx from 'xlsx';
import AnyObj from '../../../../shared/models/any-obj';
import {injector, lazyInject} from '../../../lib/common/inversify.config';
import DatabaseController from '../../database/controller';
import {SyncMap} from '../../../../shared/models/sync-map';
import {DisregardError} from '../../../lib/common/disregard-error';


interface FilterLevel {
  productLevel: string;
  salesLevel: string;
  scmsLevel: string;
  internalBELevel: string;
  entityLevel: string;
}

@injectable()
export default class SubmeasureController extends ApprovalController {
  @lazyInject(DatabaseController) databaseController;

  constructor(
    protected repo: SubmeasureRepo,
    protected pgRepo: SubmeasurePgRepo,
    protected inputLevelPgRepo: InputLevelPgRepo,
    private lookupRepo: LookupRepo,
    private productClassUploadRepo: ProductClassUploadRepo,
    private deptUploadRepo: DeptUploadRepo,
    private fileRepo: FileRepo
  ) {
    super(repo);
  }

  mongoToPgSyncTransform(subs, userId, log, elog) {
    const tableName = 'dfa_submeasure_input_lvl';
    const records = [];
    subs.forEach(sub => {
      this.addFilterLevelRecords('I', sub.inputFilterLevel, sub, records, log, elog);
      if (sub.indicators.manualMapping) {
        this.addFilterLevelRecords('M', sub.manualMapping, sub, records, log, elog);
      }
    });
    return this.inputLevelPgRepo.syncRecordsReplaceAll({}, records, userId, true)
      .then(results => {
        log.push(`dfa_submeasure_input_lvl: ${results.recordCount} records transferred`);
        return subs;
      });
  }

  addFilterLevelRecords(flag, fl, sub, records, log, elog) {
    ['productLevel', 'salesLevel', 'scmsLevel', 'internalBELevel', 'entityLevel', 'glSegLevel'].forEach(flProp => {

      if (flag === 'I' && flProp === 'glSegLevel' && fl[flProp] && fl[flProp].length) {
        fl[flProp].forEach(glsegProp => {
          const map = _.find(filterLevelMap, {prop: flProp, levelName: glsegProp});
          if (!map) {
            elog.push(`dfa_submeasure_input_lvl: no filterLevelMap for flag/prop/levelName: ${flag}/${flProp}/${glsegProp}`);
            return;
          }
          records.push(new SubmeasureInputLvl(
            sub.moduleId,
            sub.submeasureKey,
            map.hierarchyId,
            flag,
            map.levelId,
            map.levelName,
            sub.createdBy,
            sub.createdDate,
            sub.updatedBy,
            sub.updatedDate
          ));

        });
      } else if (flProp !== 'glSegLevel' && fl[flProp]) {
        const map = _.find(filterLevelMap, {prop: flProp, levelName: fl[flProp]});
        if (!map) {
          elog.push(`dfa_submeasure_input_lvl: no filterLevelMap for flag/prop/levelName: ${flag}/${flProp}/${fl[flProp]}`);
          return;
        }
        records.push(new SubmeasureInputLvl(
          sub.moduleId,
          sub.submeasureKey,
          map.hierarchyId,
          flag,
          map.levelId,
          map.levelName,
          sub.createdBy,
          sub.createdDate,
          sub.updatedBy,
          sub.updatedDate
        ));
      }
    });
  }

  pgToMongoSync(userId, log, elog) {
    return Promise.all([
      this.pgRepo.getMany(),
      this.inputLevelPgRepo.getMany()
    ])
      .then(results => {
        const subs = results[0];
        const ifls = results[1];
        this.setFilterLevels(subs, ifls, log, elog);
        subs.forEach(sub => {
          sub.rules = sub.rules.filter(x => !!x); // clean out null rules
          sub.inputFilterLevel = sub.inputFilterLevel || {};
          sub.manualMapping = sub.manualMapping || {};
          sub.activeStatus = sub.status;
        });
        return this.repo.syncRecordsReplaceAll({}, subs, userId, true, true)
          .then(() => {
            log.push(`submeasure: ${subs.length} records transferred`);
          });
      })
      .catch(err => {
        elog.push(err);
      });
  }

  setFilterLevels(subs, filterLevels, log, elog) {
    filterLevels.forEach(fl => {
      const sub = _.find(subs, {submeasureKey: fl.submeasureKey});
      if (!sub) {
        elog.push(`setFilterLevels: no matching submeasure for submeasureKey: ${fl.submesureKey}.`);
        return;
      }
      const map = _.find(filterLevelMap, {hierarchyId: fl.hierarchyId});
      if (!map) {
        elog.push(`setFilterLevels: can't find map for hierarchyId: ${fl.hierarchyId}`);
        return;
      }
      let path: string;
      if (fl.inputLevelFlag === 'I') {
        path = 'inputFilterLevel.' + map.prop;
        // glseg is ifl only, not in mm section
        // glseg is an array of strings (one per record) whereas the rest are just strings
        if (map.prop === 'glSegLevel') {
          const arr = _.get(sub, path);
          if (arr) {
            arr.push(fl.levelName);
          } else {
            _.set(sub, path, [fl.levelName]);
          }
        } else {
          _.set(sub, path, fl.levelName);
        }
      } else if (fl.inputLevelFlag === 'M') {
        path = 'manualMapping.' + map.prop;
        _.set(sub, path, fl.levelName);
      } else {
        elog.push(`setFilterLevels: invalid inputLevelFlag: ${fl.inputLevelFlag}`);
        return;
      }
    });
  }

  getGroupingSubmeasures(req, res, next) {
    const measureId = req.body.measureId;
    if (!measureId) {
      throw new ApiError('getGroupingSubmeasures called with no measureId.');
    }
    this.repo.getManyLatestGroupByNameActive(req.dfa.moduleId, {
      measureId,
      'indicators.groupFlag': 'Y'
    })
      .then(docs => res.json(docs));
  }

  sendApprovalEmail(approveRejectMessage, req, mode: ApprovalMode, item): Promise<any> {
    const omitProperties = [
      '_id', 'id', 'status', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate', '__v', 'approvedOnce',
      'indicators._id', 'inputFilterLevel._id', 'manualMapping._id', 'approvalUrl', 'approvalReminderTime',
    ];
    return this.sendApprovalEmailBase(approveRejectMessage, req, mode, item, 'submeasure', omitProperties);
  }

  // we need this sync to happen
  approveMany(req, res, next) {
    return super.approveMany(req, res, next, true)
      .then(() => {
        const items = req.body;
        let manualMix, deptUpload;
        items.forEach(sm => {
          if (shUtil.isManualMix(sm)) {
            manualMix = true;
          }
          if (shUtil.isDeptUpload(sm)) {
            deptUpload = true;
          }
        });
        return this.doManualMixAndDeptUploadSync(manualMix, deptUpload, req)
          .then(() => res.json({status: 'success'}));
      })
      .catch(next);
  }

  approveOne(req, res, next) {
    const sm = req.body;
    return super.approveOne(req, res, next, true)
      .then(item => {
        return this.doManualMixAndDeptUploadSync(shUtil.isManualMix(sm), shUtil.isDeptUpload(sm), req)
          .then(() => res.json(item));
      })
      .catch(next);
  }

  doManualMixAndDeptUploadSync(manualMix, deptUpload, req) {
    if (!manualMix && !deptUpload) {
      return Promise.resolve();
    }

    // we have to avoid circular reference between DatabaseController and SubmeasureController. This required changes in both places
    // to overcome. See DatabaseController constructor for more info
    const databaseCtrl = injector.get(DatabaseController);
    const syncMap = new SyncMap();
    if (manualMix) {
      syncMap.dfa_prof_swalloc_manualmix_upld = true;
    }
    if (deptUpload) {
      syncMap.dfa_prof_dept_acct_map_upld = true;
    }
    return shUtil.promiseChain(databaseCtrl.mongoToPgSyncPromise(req.dfa, {syncMap}, req.user.id))
      .catch(err => {
        throw new ApiError('Approval succeeded, but there was a sync error for the manual mix or department upload data.', err);
      });
  }

  preApproveStep(sm, firstTimeApprove, req) {
    const promises = [];
    // remove product class uploads for this submeasure and add new ones
    if (shUtil.isManualMix(sm)) {
      promises.push(this.productClassUploadRepo.removeMany({submeasureName: sm.name})
        .then(() => {
          return this.productClassUploadRepo.addManyTransaction([
            {fiscalMonth: req.dfa.module.fiscalMonth, submeasureName: sm.name, splitCategory: 'HARDWARE', splitPercentage: sm.manualMixHw ? sm.manualMixHw / 100 : undefined},
            {fiscalMonth: req.dfa.module.fiscalMonth, submeasureName: sm.name, splitCategory: 'SOFTWARE', splitPercentage: sm.manualMixSw ? sm.manualMixSw / 100 : undefined}
          ], sm.updatedBy)
            .then(() => {
              delete sm.manualMixHw;
              delete sm.manualMixSw;
            });
        }));
    }
    if (shUtil.isDeptUpload(sm) && sm.indicators.deptAcct === 'A') {
      // find temp=Y records, if found, delete for sm.name && temp = N, then change these to temp Y >> N
      promises.push(
        this.deptUploadRepo.getMany({submeasureName: sm.name, temp: 'Y'})
          .then(tempRecords => {
            if (tempRecords.length) {
              return this.deptUploadRepo.removeMany({submeasureName: sm.name, temp: 'N'})
                .then(() => this.deptUploadRepo.updateMany({submeasureName: sm.name, temp: 'Y'}, {$set: {temp: 'N'}}));
            }
          })
          .then(() => {
            sm.indicators.deptAcct = 'D';
          })
      );
    }
    return Promise.all(promises)
      .then(() => sm);
  }

  preRejectStep(sm, req) {
    // two ways to go, leave dept upload or toss it. Thing is: they can upload and not even save the submeasure, so will
    // always have possiblity of these around. Maybe something small to change and then they'd have to add it again
    // so leave it for now. The concern is: you leave these around on reject (or upload but never submit), and then
    // someone edit's one (but deptAcct flag will be Y then)
    return Promise.resolve(sm);
    /*
    if (shUtil.isDeptUpload(sm) && sm.indicators.deptAcct === 'A') {
      // remove any temp records associated with this submeasure
      return this.deptUploadRepo.removeMany({submeasureName: sm.name, temp: 'Y'})
        .then(() => {
          sm.indicators.deptAcct = 'Y';
        });
    } else {
      return Promise.resolve(sm);
    }
*/
  }

  downloadDeptUploadMapping(req, res, next) {
    this.verifyProperties(req.query, ['submeasureName']);
    const submeasureName = req.query.submeasureName;
    Promise.all([
      this.deptUploadRepo.getMany({submeasureName, temp: 'N'}),
      this.fileRepo.getMany({directory: Directory.profBusinessUpload, buFileType: BusinessUploadFileType.template, buUploadType: 'dept-upload'})
    ])
      .then(results => {
        const records: DeptUploadImport[] = results[0];
        const fileInfo = results[1][0];

        let sheet1Rows = [];
        const sheet2Rows = [];
        records.forEach(rec => {
          sheet1Rows.push([rec.submeasureName, rec.nodeValue]);
          if (rec.glAccount) {
            sheet2Rows.push([rec.submeasureName, rec.glAccount]);
          }
          sheet1Rows = _.uniqWith(sheet1Rows, _.isEqual);
        })

        const gfs = new mgc.mongo.GridFSBucket(mgc.db);
        const tempStream = gfs.openDownloadStream(new mgc.mongo.ObjectID(fileInfo.id));
        tempStream.on('error', next);
        svrUtil.streamToBuffer(tempStream)
          .then(tempBuffer => {
            const readOptions = {cellNF: true, cellStyles: true, cellHTML: true, cellText: true};
            const workbook = xlsx.read(tempBuffer, readOptions);
            const deptSheet = workbook.Sheets[workbook.SheetNames[0]];
            const glaccountSheet = workbook.Sheets[workbook.SheetNames[1]];
            xlsx.utils.sheet_add_aoa(deptSheet, sheet1Rows, {origin: -1});
            xlsx.utils.sheet_add_aoa(glaccountSheet, sheet2Rows, {origin: -1});

            const writeOptions = {bookType: 'xlsx', bookSST: false, type: 'buffer'};
            const outBuffer = xlsx.write(workbook, <any>writeOptions);
            res.set('Content-Type', fileInfo.contentType);
            const fileName = `dept-upload_${_.snakeCase(submeasureName)}.xlsx`;
            res.set('Content-Disposition', `attachment; filename="${fileName}"`);
            const outStream = svrUtil.bufferToStream(outBuffer);
            outStream.pipe(res);
          });
      })
      .catch(next);
  }

}

