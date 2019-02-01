import {injectable} from 'inversify';
import SubmeasureRepo from './repo';
import {ApiError} from '../../../lib/common/api-error';
import SubmeasurePgRepo from './pgrepo';
import InputLevelPgRepo, {SubmeasureInputLvl} from './input-level-pgrepo';
import * as _ from 'lodash';
import {filterLevelMap} from '../../../../shared/models/filter-level-map';
import ApprovalController from '../../../lib/base-classes/approval-controller';
import {ApprovalMode} from '../../../../shared/enums';
import LookupRepo from '../../lookup/repo';
import {shUtil} from '../../../../shared/shared-util';
import ProductClassUploadRepo from '../../prof/product-class-upload/repo';
import DeptUploadRepo from '../../prof/dept-upload/repo';


interface FilterLevel {
  productLevel: string;
  salesLevel: string;
  scmsLevel: string;
  internalBELevel: string;
  entityLevel: string;
}

@injectable()
export default class SubmeasureController extends ApprovalController {

  constructor(
    protected repo: SubmeasureRepo,
    protected pgRepo: SubmeasurePgRepo,
    protected inputLevelPgRepo: InputLevelPgRepo,
    private lookupRepo: LookupRepo,
    private productClassUploadRepo: ProductClassUploadRepo,
    private deptUploadRepo: DeptUploadRepo
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
    ['productLevel', 'salesLevel', 'scmsLevel', 'internalBELevel', 'entityLevel'].forEach(flProp => {
      if (fl[flProp]) {
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
      } else if (fl.inputLevelFlag === 'M') {
        path = 'manualMapping.' + map.prop;
      } else {
        elog.push(`setFilterLevels: invalid inputLevelFlag: ${fl.inputLevelFlag}`);
        return;
      }
      _.set(sub, path, fl.levelName);
    });
  }

  getGroupingSubmeasures(req, res, next) {
    const measureId = req.body.measureId;
    if (!measureId) {
      throw new ApiError('getGroupingSubmeasures called with no measureId');
    }
    this.repo.getManyByGroupLatest({
      groupField: 'name',
      status: 'A',
      moduleId: req.body.moduleId,
      measureId,
      'indicators.groupFlag': 'Y'
    })
      .then(docs => res.json(docs));
  }

  sendApprovalEmail(req, mode: ApprovalMode, item): Promise<any> {
    const omitProperties = [
      '_id', 'id', 'status', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate', '__v', 'approvedOnce',
      'indicators._id', 'inputFilterLevel._id', 'manualMapping._id',
    ];
    return this.sendApprovalEmailBase(req, mode, item, 'submeasure', 'submeasure', omitProperties);
  }

  postApproveStep(sm, req) {
    const promises = [];
    // remove product class uploads for this submeasure and add new ones
    if (sm.categoryType === 'Manual Mix') {
      promises.push(this.productClassUploadRepo.removeMany({submeasureName: sm.name})
        .then(() => {
          return this.productClassUploadRepo.addManyTransaction([
            {fiscalMonth: req.dfa.module.fiscalMonth, submeasureName: sm.name, splitCategory: 'HARDWARE', splitPercentage: sm.manualMixHw},
            {fiscalMonth: req.dfa.module.fiscalMonth, submeasureName: sm.name, splitCategory: 'SOFTWARE', splitPercentage: sm.manualMixSw}
          ], req.user.id)
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

  postRejectStep(sm, req) {
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

}

