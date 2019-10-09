import AllocationRuleRepo from './repo';
import {injectable} from 'inversify';
import PgLookupRepo from '../../pg-lookup/repo';
import {ApiError} from '../../../lib/common/api-error';
import ApprovalController from '../../../lib/base-classes/approval-controller';
import {ApprovalMode} from '../../../../shared/misc/enums';
import LookupRepo from '../../lookup/repo';
import {svrUtil} from '../../../lib/common/svr-util';
import {shUtil} from '../../../../shared/misc/shared-util';
import _ from 'lodash';
import AnyObj from '../../../../shared/models/any-obj';
import {ruleUtil} from '../../../../shared/misc/rule-util';
import {SelectExceptionMap} from '../../../../shared/classes/select-exception-map';

@injectable()
export default class AllocationRuleController extends ApprovalController {
  constructor(repo: AllocationRuleRepo, private lookupRepo: LookupRepo, private pgLookupRepo: PgLookupRepo) {
    super(repo);
  }

  saveToDraft(req, res, next) {
    super.saveToDraft(req, res, next);
  }

  sendApprovalEmail(approveRejectMessage, req, mode: ApprovalMode, item): Promise<any> {
    const omitProperties = ['_id', 'id', '__v', 'status', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate', 'approvedOnce',
      'salesSL1CritCond', 'salesSL1CritChoices', 'salesSL2CritCond', 'salesSL2CritChoices', 'salesSL3CritCond', 'salesSL3CritChoices',
      'prodPFCritCond', 'prodPFCritChoices', 'prodBUCritCond', 'prodBUCritChoices', 'prodTGCritCond', 'prodTGCritChoices',
      'scmsCritCond', 'scmsCritChoices', 'beCritCond', 'beCritChoices', 'approvalUrl', 'approvalReminderTime',
      'salesSL1IpCritCond', 'salesSL1IpCritChoices', 'salesSL2IpCritCond', 'salesSL2IpCritChoices', 'salesSL3IpCritCond', 'salesSL3IpCritChoices',
    ];
    return this.sendApprovalEmailBase(approveRejectMessage, req, mode, item, 'rule', omitProperties);
  }

  approveValidate(approvalItems, req, next) {
    return super.approveValidate(approvalItems, req, next)
      .then(aiItems => {
        return this.repo.getManyLatestGroupByNameActiveInactiveConcatDraftPending(req.dfa.moduleId)
          .then(aidpItems => {
            aidpItems.forEach(rule => ruleUtil.createSelectArrays(rule));
            const selectMap = new SelectExceptionMap();
            // this will crash if there are any clashes in exceptions. This should never happen, but we need to know if it does and this
            // and the rule edit page are both good places to verify.
            selectMap.parseRules(aidpItems);
          })
          // needed to catch selectMap errors
          .catch(next);
      });
  }

}

