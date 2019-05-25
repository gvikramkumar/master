import request from 'supertest';
import {serverPromise} from '../../server';
import _ from 'lodash';
import SubmeasureRepo from '../common/submeasure/repo';
import AllocationRuleRepo from '../common/allocation-rule/repo';
import {mail} from '../../lib/common/mail';
import AnyObj from '../../../shared/models/any-obj';

describe(`Job Run tests`, () => {
  let server;
  let orgSms = [];
  let orgRules = [];
  const smRepo = new SubmeasureRepo();
  const ruleRepo = new AllocationRuleRepo();
  beforeAll((done) => {
    serverPromise.then(_server => {
      server = _server;
      Promise.all([
        smRepo.getMany({moduleId: -1}),
        ruleRepo.getMany({moduleId: -1})
      ])
        .then(results => {
          orgSms = results[0];
          orgRules = results[1];
          done();
        });
    });
  });
  afterAll((done) => {
    orgSms.forEach(item => smRepo.update(item, 'jodoe', false, false, false));
    orgRules.forEach(item => ruleRepo.update(item, 'jodoe', false, false, false));
    done();
  });

  afterEach(() => {
    (<AnyObj>mail).sendHtmlMail.calls.reset();
  });

  it(`should NOT send pending approval emails if no rules/submeasures are pending and reminder time is less than 24 hours`, (done) => {
    request(server)
      .get('/api/run-job/approval-email-reminder')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.status).toEqual('success');
        expect(res.body.data).toEqual('No pending Submeasures found, No pending Rules found');
      })
      .end(done);
  });

  it(`should send pending approval emails for all rules/submeasures that are pending and reminder time is more than 24 hours`, (done) => {
    const sms = _.cloneDeep(orgSms);
    const rules = _.cloneDeep(orgRules);
    const promises = [];
    sms.forEach(item => {
      item.status = 'P';
      item.approvalReminderTime = new Date(Date.now() - (24 * 60 * 60 * 1000) - (60 * 1000));
      promises.push(smRepo.update(item, 'jodoe', false, false, false));
    });

    rules.forEach(item => {
      item.status = 'P';
      item.approvalReminderTime = new Date(Date.now() - (24 * 60 * 60 * 1000) - (60 * 1000));
      promises.push(ruleRepo.update(item, 'jodoe', false, false, false));
    });

    Promise.all(promises)
      .then(() => {
        request(server)
         .get('/api/run-job/approval-email-reminder')
         .expect(200)
         .expect((res) => {
           expect(res.body).toBeDefined();
           expect(res.body.status).toEqual('success');
           expect(res.body.data.trim()).toEqual(`Submeasures updated - ${sms.length},  Rules updated - ${rules.length}`);
         })
         .end(done);
      });
  });
});
