import {serverPromise} from '../../server';
import ApprovalController from './approval-controller';
import SubmeasureRepo from '../../api/common/submeasure/repo';
import {shUtil} from '../../../shared/misc/shared-util'
import LookupRepo from '../../api/lookup/repo';
import {ModuleRepo} from '../../api/common/module/repo';
import UserListRepo from '../../api/user-list/repo';
import {mail} from '../common/mail';
import AnyObj from '../../../shared/models/any-obj';


describe('Approval Controller Tests >>>>>', () => {
  let server, repo, approvalController;

  beforeAll(function(done) {
    serverPromise.then(_server => {
      server = _server;
      done();
    });
  });

  describe(`Approval Email Reminder>>>>>>`, () => {
    beforeEach(() => {
      repo = new SubmeasureRepo();
      approvalController = new ApprovalController(repo);
    });

     it('should get pending submeasures', () => {
      repo.getManyPending({moduleId: -1})
        .then(pendingItems => {
          expect(pendingItems.length).toEqual(1);
          expect(pendingItems[0].name).toEqual('2 Tier Adjustment');
          expect(pendingItems[0].status).toEqual('P');
          expect(pendingItems[0].approvalUrl).toEqual(`http://localhost:4200/prof/submeasure/edit/5cd5c201b2db8208c0cb4c2f;mode=view`);
        });
    });

    it('should get admin emails', () => {
      new LookupRepo().getValues(['itadmin-email', 'dfa-admin-email', 'dfa-biz-admin-email'])
        .then(results => {
          expect(results.length).toEqual(3);
          expect(results[0]).toEqual(`dfa-admin@cisco.com`);
          expect(results[1]).toEqual(`dfa-admin@cisco.com`);
          expect(results[2]).toEqual(`dfa_business_admin@cisco.com`);
        });
    });

    it('should get the module', () => {
      new ModuleRepo().getOneByQuery({moduleId: 1})
        .then(module => {
          expect(module).toBeTruthy();
          expect(module.moduleId).toEqual(1);
          expect(module.name).toEqual(`Profitability Allocations`);
        });
    });

    it(`should get the user`, () => {
      new UserListRepo().getOneLatest({userId: 'jodoe'})
        .then(user => {
          expect(user).toBeTruthy();
          expect(user.email).toEqual(`jodoe@cisco.com`);
          expect(user.fullName).toEqual(`John Doe`);
        });
    });

    it(`sendReminderEmail - test`, () => {
      const itadminEmail = 'itadminEmail';
      const dfaAdminEmail = 'dfaAdminEmail';
      const dfaBizAdminEmail = 'dfaBizAdminEmail';
      const adminEmail = [itadminEmail, dfaAdminEmail, dfaBizAdminEmail];

      const moduleName = `Module Name`;
      const fullName = `User Name`;
      const approvalUrl = `Approval Url`;
      const email = `updatedby@cisco.com`;
      const user = {fullName, email};
      const updatedDate = new Date();
      const item = {
        approvalUrl,
        updatedDate
      };
      const subject = `DFA - ${moduleName} - Submeasure Pending for Approval`;
      const body = `A new DFA - Submeasure submitted by ${fullName} has been pending for approval since ${shUtil.convertToPSTTime(item.updatedDate)}:<br><br><a href="${approvalUrl}">${approvalUrl}</a>`;

      approvalController.sendReminderEmail(adminEmail, {name: moduleName}, {fullName, email}, item, 'submeasure');
      const args = (<AnyObj>mail).sendHtmlMail.calls.allArgs()[0];
      expect(mail.sendHtmlMail).toHaveBeenCalled();
      expect(args[0]).toBe(dfaAdminEmail);
      expect(args[1]).toBe(dfaBizAdminEmail);
      expect(args[2]).toBe(`${adminEmail[0]},${email}`);
      expect(args[3]).toBe(subject);
      expect(args[4]).toBe(body);
    });
  });
  });
