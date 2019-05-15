import config from '../../config/get-config';
import {injector} from './inversify.config';
import SubmeasureController from '../../api/common/submeasure/controller';
import AllocationRuleController from '../../api/common/allocation-rule/controller';

export function approvalEmailReminder() {
  setInterval(() => {
    injector.get(SubmeasureController).approvalEmailReminder('submeasure');
    injector.get(AllocationRuleController).approvalEmailReminder('rule');
  }, config.submitForApprovalReminderInterval);
 }

