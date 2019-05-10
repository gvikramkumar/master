import {serverPromise} from '../../server';
import SubmeasureController from '../../api/common/submeasure/controller';
import ApprovalController from './approval-controller';
import SubmeasureRepo from '../../api/common/submeasure/repo';
import {svrUtil} from '../common/svr-util';
import {shUtil} from '../../../shared/misc/shared-util';


describe('Approval Controller Tests', () => {
  let server, approvalController;

  beforeAll(function(done) {
    serverPromise.then(_server => {
      server = _server;
      done();
    });
  });

  beforeEach(() => {
    approvalController = new ApprovalController(new SubmeasureRepo());
  });

   /* it('should send a reminder email', () => {
        /!*const approvalController = new ApprovalController(new SubmeasureRepo());
        spyOn(approvalController, 'sendReminderEmail');
        approvalController.approvalEmailReminder('submeasure')
          .then(() => {
            expect(approvalController.sendReminderEmail).toHaveBeenCalled();
          });*!/
    });*/

   it(`sendReminderEmail - test`, () => {
     const adminEmail = [`itadminEmail`, `dfaAdminEmail`, `dfaBizAdminEmail`];
     const moduleName = `Module Name`;
     const fullName = `User Name`;
     const approvalUrl = `Approval Url`;
     const updatedBy = `updatedby`;
     const updatedDate = new Date();
     const item = {
       approvalUrl,
       updatedBy,
       updatedDate
     };
     const subject = `$LOCAL: DFA - ${moduleName} - Submeasure Pending for Approval`;
     const body = `A new DFA - Submeasure submitted by ${fullName} has been pending for approval since ${shUtil.convertToPSTTime(item.updatedDate)}`;

     const sendHtmlMail = jasmine.createSpy('sendHtmlEmail');

     approvalController.sendReminderEmail(adminEmail, {name: moduleName}, {fullName}, item, 'submeasure', sendHtmlMail);
     const args = sendHtmlMail.calls.allArgs()[0];
     // expect(sendHtmlMail).toHaveBeenCalledWith(adminEmail[1], adminEmail[2], `${adminEmail[0]},${updatedBy}@cisco.com`, subject, body);
      expect(args[0]).toBe(adminEmail[1]);
   });
});
