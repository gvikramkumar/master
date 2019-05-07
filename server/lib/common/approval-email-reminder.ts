import ApprovalController from '../base-classes/approval-controller';
import SubmeasureRepo from '../../api/common/submeasure/repo';
import AllocationRuleRepo from '../../api/common/allocation-rule/repo';
import config from '../../config/get-config';

export function approvalEmailReminder() {
  setInterval(() => {
    new ApprovalController(new SubmeasureRepo()).approvalEmailReminder('submeasure');
    new ApprovalController(new AllocationRuleRepo()).approvalEmailReminder('rule');
  }, config.submitForApprovalPeriod);
 }



