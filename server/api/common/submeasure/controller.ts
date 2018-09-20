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
    protected inputLevelPgRepo: InputLevelPgRepo
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

  sendApprovalEmail(req, mode: ApprovalMode, submeasureId) {
    const data = req.body;
    const url = `${req.headers.origin}/prof/submeasure/edit/${submeasureId};mode=edit`;
    const link = `<a href="${url}">${url}</a>`
    switch (mode) {
      case ApprovalMode.submit:
        let prefix;
        if (data.approvedOnce === 'Y') {
          prefix = 'An updated';
        } else {
          prefix = 'A new';
        }
        this.sendEmail(req.user.email,
          'DFA: Submeasure Submitted for Approval',
          `${prefix} DFA submeasure has been submitted by ${req.user.fullName} for approval: <br>${link}`);
        break;
      case ApprovalMode.approve:
        this.sendEmail(req.user.email,
          'DFA: Submeasure Approved',
          `The DFA submeasure submitted by ${req.user.fullName} for approval has been approved:<br>${link}`);
        break;
      case ApprovalMode.reject:
        this.sendEmail(req.user.email,
          'DFA: Submeasure Not Approved',
          `The DFA submeasure submitted by ${req.user.fullName} for approval has been rejected:<br>${link}`);
        break;
      }
  }

}

