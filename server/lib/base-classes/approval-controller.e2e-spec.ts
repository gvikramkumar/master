import {serverPromise} from '../../server';
import SubmeasureController from '../../api/common/submeasure/controller';
import ApprovalController from './approval-controller';
import SubmeasureRepo from '../../api/common/submeasure/repo';
import {shUtil} from '../../../shared/misc/shared-util';
import {mail} from '../common/mail';
import AnyObj from '../../../shared/models/any-obj';


fdescribe('Approval Controller Tests', () => {
  let server, approvalController;
  const sendHtmlMail = mail.sendHtmlMail;

  beforeAll(function(done) {
    // how we'll mock "just for this test suite
    // mail.sendHtmlMail = jasmine.createSpy();
    serverPromise.then(_server => {
      server = _server;
      done();
    });
  });

  afterAll(() => {
    // how we'll mock "just for this test suite
    // mail.sendHtmlMail = sendHtmlMail;
  })

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

     approvalController.sendReminderEmail(adminEmail, {name: moduleName}, {fullName}, item, 'submeasure');
     const args = (<AnyObj>mail).sendHtmlMail.calls.allArgs()[0];
     // expect(sendHtmlMail).toHaveBeenCalledWith(adminEmail[1], adminEmail[2], `${adminEmail[0]},${updatedBy}@cisco.com`, subject, body);
      expect(args[0]).toBe(adminEmail[1]);
   });
});
