import {serverPromise} from '../../server';
import SubmeasureController from '../../api/common/submeasure/controller';
import ApprovalController from './approval-controller';
import SubmeasureRepo from '../../api/common/submeasure/repo';
let server;
fdescribe('Approval Controller Tests', () => {
  beforeAll(function(done) {
    serverPromise.then(_server => {
      server = _server;
      done();
    });
  });

    it('should send a reminder email', () => {
        const approvalController = new ApprovalController(new SubmeasureRepo());
        spyOn(approvalController, 'sendReminderEmail');
        approvalController.approvalEmailReminder('submeasure')
          .then(() => {
            expect(approvalController.sendReminderEmail).toHaveBeenCalled();
          });
    });
});
