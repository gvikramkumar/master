import {serverPromise} from '../../server';
import _ from 'lodash';
import {shUtil} from '../../../shared/misc/shared-util';
import {mail} from '../common/mail';
import AnyObj from '../../../shared/models/any-obj';
import ApprovalController from './approval-controller';
import SubmeasureRepo from '../../api/common/submeasure/repo';
import AllocationRuleRepo from '../../api/common/allocation-rule/repo';
import {svrUtil} from '../common/svr-util';


describe('Approval Controller Tests', () => {
  let server;

  beforeAll(function (done) {
    serverPromise.then(_server => {
      server = _server;
      done();
    });
  });

  describe(`Approval Email Reminder`, () => {
    let smRepo, ruleRepo, approvalControllerForSubmeasure, approvalControllerForRule;
    beforeAll(() => {
      smRepo = new SubmeasureRepo();
      ruleRepo = new AllocationRuleRepo();
      approvalControllerForSubmeasure = new ApprovalController(smRepo);
      approvalControllerForRule = new ApprovalController(ruleRepo);
    });

    it(`sendReminderEmail - test`, (done) => {
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
      const getEnvEmailOriginalFunction = svrUtil.getEnvEmail;
      spyOn(svrUtil, 'getEnvEmail').and.callFake(val => val);
      const subject = `DFA - ${moduleName} - Submeasure Pending for Approval`;
      const body = `A new DFA - Submeasure submitted by ${fullName} has been pending for approval since ${shUtil.convertToPSTTime(item.updatedDate)}:<br><br><a href="${approvalUrl}">${approvalUrl}</a>`;
      approvalControllerForSubmeasure.sendReminderEmail(adminEmail, {name: moduleName}, user, item, 'submeasure');
      const args = (<AnyObj>mail).sendHtmlMail.calls.allArgs()[0];
      expect(mail.sendHtmlMail).toHaveBeenCalled();
      expect(args[0]).toBe(dfaAdminEmail);
      expect(args[1]).toBe(dfaBizAdminEmail);
      expect(args[2]).toBe(`${adminEmail[0]},${email}`);
      expect(args[3]).toBe(subject);
      expect(args[4]).toBe(body);
      svrUtil.getEnvEmail = getEnvEmailOriginalFunction;
      done();
    });

    describe(`approvalEmailReminder - Submeasure`, () => {
      let orgSms = [];
      beforeAll((done) => {
        smRepo.getMany({moduleId: -1, name: /E2ETEST/})
          .then(sms => {
            orgSms = sms;
            spyOn(approvalControllerForSubmeasure, 'sendReminderEmail');
            approvalControllerForSubmeasure.sendReminderEmail.and.returnValue(Promise.resolve());
            done();
          });
      });
      afterAll((done) => {
        orgSms.forEach(item => smRepo.update(item, 'jodoe', false, false, false));
        done();
      });

      beforeEach(() => {
        approvalControllerForSubmeasure.sendReminderEmail.calls.reset();
      });

      it(`should NOT call sendReminderEmail if less than 24 hours - multiple submeasures/modules`, (done) => {
        const sm = _.cloneDeep(orgSms[0]);
        sm.status = 'P';
        sm.approvalReminderTime = new Date(Date.now() - (24 * 60 * 60 * 1000) + (10 * 1000));
        smRepo.update(sm, 'jodoe', false)
          .then(() => {
            approvalControllerForSubmeasure.approvalEmailReminder('submeasure')
              .then(() => {
                expect(approvalControllerForSubmeasure.sendReminderEmail).not.toHaveBeenCalled();
                done();
              });
          });
      });

      it(`should call sendReminderEmail if more than 24 hours - one submeasure/module`, (done) => {
        const sm = _.cloneDeep(orgSms[0]);
        sm.status = 'P';
        sm.approvalReminderTime = new Date(Date.now() - (24 * 60 * 60 * 1000) - (10 * 1000));
        smRepo.update(sm, 'jodoe', false)
          .then(() => {
            const updatedSm = _.cloneDeep(sm);
            const currentTime = new Date();
            approvalControllerForSubmeasure.approvalEmailReminder('submeasure')
              .then(() => {
                expect(approvalControllerForSubmeasure.sendReminderEmail).toHaveBeenCalled();
                const args = approvalControllerForSubmeasure.sendReminderEmail.calls.allArgs()[0];
                expect(args[0]).toEqual(['dfa-it-admin@cisco.com', 'dfa-admin@cisco.com', 'dfa_business_admin@cisco.com']);
                expect(args[1].moduleId).toEqual(1);
                expect(args[1].name).toEqual('Profitability Allocations');
                expect(args[2].userId).toEqual('jodoe');
                updatedSm.approvalReminderTime = currentTime; // this is all we change in approvalEmailReminder, so set, then can use isEqual
                expect(args[3].toObject()).toEqual(updatedSm.toObject());
                expect(args[4]).toEqual('submeasure');
                done();
              });
          });
      });

      it(`should call sendReminderEmail for all submeasures that are pending for more than 24 hours - multiple submeasures/modules`, (done) => {
        const sms = _.cloneDeep(orgSms);
        const promises = [];
        sms.forEach(item => {
          item.status = 'P';
          item.approvalReminderTime = new Date(Date.now() - (24 * 60 * 60 * 1000) - (60 * 1000));
          promises.push(smRepo.update(item, 'jodoe', false, false, false));
        });
        Promise.all(promises)
          .then(() => {
            const currentTime = new Date();
            approvalControllerForSubmeasure.approvalEmailReminder('submeasure')
              .then(() => {
                expect(approvalControllerForSubmeasure.sendReminderEmail).toHaveBeenCalledTimes(orgSms.length);
                const args = approvalControllerForSubmeasure.sendReminderEmail.calls.allArgs();
                args.forEach(arg => {
                  const smForArg = _.find(sms, {id: arg[3].id});
                  expect(smForArg).toBeDefined();
                  expect(arg[0]).toEqual(['dfa-it-admin@cisco.com', 'dfa-admin@cisco.com', 'dfa_business_admin@cisco.com']);
                  expect(smForArg.moduleId).toBe(arg[1].moduleId);
                  expect(arg[2].userId).toEqual('jodoe');
                  expect(smForArg.id).toBe(arg[3].id);
                  smForArg.approvalReminderTime = currentTime;
                  expect(smForArg.toObject()).toEqual(arg[3].toObject());
                  expect(arg[4]).toEqual('submeasure');
                });
                done();
              });
          });
      });
    });

    describe(`approvalEmailReminder - Rule`, () => {
      let orgRules = [];
      beforeAll((done) => {
        ruleRepo.getMany({moduleId: -1, name: /E2ETEST/})
          .then(rules => {
            orgRules = rules;
            spyOn(approvalControllerForRule, 'sendReminderEmail');
            approvalControllerForRule.sendReminderEmail.and.returnValue(Promise.resolve());
            done();
          });
      });
      afterAll((done) => {
        orgRules.forEach(item => ruleRepo.update(item, 'jodoe', false, false, false));
        done();
      });

      beforeEach(() => {
        approvalControllerForRule.sendReminderEmail.calls.reset();
      });

      it(`should NOT call sendReminderEmail if less than 24 hours - multiple rules/modules`, (done) => {
        const rule = _.cloneDeep(orgRules[0]);
        rule.status = 'P';
        rule.approvalReminderTime = new Date(Date.now() - (24 * 60 * 60 * 1000) + (10 * 1000));
        ruleRepo.update(rule, 'jodoe', false)
          .then(() => {
            approvalControllerForRule.approvalEmailReminder('rule')
              .then(() => {
                expect(approvalControllerForRule.sendReminderEmail).not.toHaveBeenCalled();
                done();
              });
          });
      });

      it(`should call sendReminderEmail if more than 24 hours - one rule/module`, (done) => {
        const rule = _.cloneDeep(orgRules[0]);
        rule.status = 'P';
        rule.approvalReminderTime = new Date(Date.now() - (24 * 60 * 60 * 1000) - (10 * 1000));
        ruleRepo.update(rule, 'jodoe', false)
          .then(() => {
            const updatedrule = _.cloneDeep(rule);
            const currentTime = new Date();
            approvalControllerForRule.approvalEmailReminder('rule')
              .then(() => {
                expect(approvalControllerForRule.sendReminderEmail).toHaveBeenCalled();
                const args = approvalControllerForRule.sendReminderEmail.calls.allArgs()[0];
                expect(args[0]).toEqual(['dfa-it-admin@cisco.com', 'dfa-admin@cisco.com', 'dfa_business_admin@cisco.com']);
                expect(args[1].moduleId).toEqual(1);
                expect(args[1].name).toEqual('Profitability Allocations');
                expect(args[2].userId).toEqual('jodoe');
                updatedrule.approvalReminderTime = currentTime;
                expect(args[3].toObject()).toEqual(updatedrule.toObject());
                expect(args[4]).toEqual('rule');
                done();
              });
          });
      });

      it(`should call sendReminderEmail for all rules that are pending for more than 24 hours - multiple rules/modules`, (done) => {
        const rules = _.cloneDeep(orgRules);
        const promises = [];
        rules.forEach(item => {
          item.status = 'P';
          item.approvalReminderTime = new Date(Date.now() - (24 * 60 * 60 * 1000) - (60 * 1000));
          promises.push(ruleRepo.update(item, 'jodoe', false, false, false));
        });
        Promise.all(promises)
          .then(() => {
            const currentTime = new Date();
            approvalControllerForRule.approvalEmailReminder('rule')
              .then(() => {
                expect(approvalControllerForRule.sendReminderEmail).toHaveBeenCalledTimes(orgRules.length);
                const args = approvalControllerForRule.sendReminderEmail.calls.allArgs();
                args.forEach((arg, idx) => {
                  const ruleForArg = _.find(rules, {id: arg[3].id});
                  expect(ruleForArg).toBeDefined();
                  expect(arg[0]).toEqual(['dfa-it-admin@cisco.com', 'dfa-admin@cisco.com', 'dfa_business_admin@cisco.com']);
                  expect(ruleForArg.moduleId).toBe(arg[1].moduleId);
                  expect(arg[2].userId).toEqual('jodoe');
                  expect(ruleForArg.id).toBe(arg[3].id);
                  ruleForArg.approvalReminderTime = currentTime;
                  expect(ruleForArg.toObject()).toEqual(arg[3].toObject());
                  expect(arg[4]).toEqual('rule');
                });
                done();
              });
          });
      });
    });
  });
});
