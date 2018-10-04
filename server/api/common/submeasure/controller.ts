import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import SubmeasureRepo from './repo';
import {ApiError} from '../../../lib/common/api-error';
import {GroupingSubmeasure} from './grouping-submeasure';
import SubmeasurePgRepo from './pgrepo';
import SubmeasureInputLvlPgRepo, {SubmeasureInputLvl} from './input-level-pgrepo';
import * as _ from 'lodash';
import InputLevelPgRepo from './input-level-pgrepo';
import AnyObj from '../../../../shared/models/any-obj';
import Any = jasmine.Any;
import {filterLevelMap} from '../../../../shared/models/filter-level-map';
import DfaUser from '../../../../shared/models/dfa-user';
import ApprovalController from '../../../lib/base-classes/approval-controller';
import {ApprovalMode} from '../../../../shared/enums';
import {svrUtil} from '../../../lib/common/svr-util';
import LookupRepo from '../lookup/repo';
import {sendHtmlMail} from '../../../lib/common/mail';


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
    private lookupRepo: LookupRepo
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
    this.repo.getGroupingSubmeasures(measureId)
      .then(docs => res.json(docs));
  }

  sendApprovalEmail(req, mode: ApprovalMode, sm) {
    this.verifyProperties(req.query, ['moduleId']);
    const data = req.body;
    const moduleId = Number(req.query.moduleId);
    const url = `${req.headers.origin}/prof/submeasure/edit/${sm.id};mode=edit`;
    const link = `<a href="${url}">${url}</a>`;
    let body;
    const adminEmail = svrUtil.getAdminEmail(moduleId, req.user.email);
    const promises = [];
    if (mode === ApprovalMode.submit && data.approvedOnce === 'Y') {
      promises.push(this.repo.getOneByQuery({moduleId, name: data.name, updatedDate: data.updatedDate}));
    }
    return Promise.all(promises)
      .then(results => {
        switch (mode) {
          case ApprovalMode.submit:
            if (data.approvedOnce === 'Y') {
              body = `The "${data.name}" DFA submeasure has been updated and submitted by ${req.user.fullName} for approval: <br><br>${link}`;
              const oldObj = results[0];
              if (oldObj) {
                if (sm.toObject) {
                  sm = sm.toObject();
                }
                body += '<br><br><b>Summary of changes:</b><br><br>' + svrUtil.getObjectDifferences(
                  oldObj.toObject(),
                  sm, [
                    '_id', 'id', 'indicators._id', 'inputFilterLevel._id', 'manualMapping._id',
                    'createdBy', 'createdDate', 'updatedBy', 'updatedDate', '__v']);
              }
            } else {
              body = `A new DFA submeasure has been submitted by ${req.user.fullName} for approval: <br><br>${link}`;
            }
            return sendHtmlMail(req.user.email, adminEmail,   `DFA - ${_.find(req.dfaData.modules, {moduleId}).name} - Submeasure Submitted for Approval`, body);
          case ApprovalMode.approve:
            body = `The DFA submeasure submitted by ${req.user.fullName} for approval has been approved:<br><br>${link}`;
            if (data.approveRejectMessage) {
              body += `<br><br><br>Comments:<br><br>${data.approveRejectMessage}`;
            }
            return sendHtmlMail(adminEmail, req.user.email, `DFA - ${_.find(req.dfaData.modules, {moduleId}).name} - Submeasure Approved`, body);
          case ApprovalMode.reject:
            body = `The DFA submeasure submitted by ${req.user.fullName} for approval has been rejected:<br><br>${link}`;
            if (data.approveRejectMessage) {
              body += `<br><br><br>Comments:<br><br>${data.approveRejectMessage}`;
            }
            return sendHtmlMail(adminEmail, req.user.email, `DFA - ${_.find(req.dfaData.modules, {moduleId}).name} - Submeasure Not Approved`, body);
        }
      });
  }

}

