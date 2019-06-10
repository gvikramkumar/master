import request from 'supertest';
import {serverPromise} from '../../../server';
import AllocationRuleRepo from './repo';
import {svrUtil} from '../../../lib/common/svr-util';

let server;
describe('allocation rule tests', () => {
  const endpoint = '/api/allocation-rule';
  const ruleRepo = new AllocationRuleRepo();
  beforeAll(function (done) {
    serverPromise.then(function (_server) {
      server = _server;
      done();
    });
  });

  it('should get many', function (done) {
    request(server)
      .get(`${endpoint}?moduleId=1`)
      .expect(200)
      .end((err, res) => {
        ruleRepo.getMany({moduleId: 1})
          .then(rules => {
            expect(rules.map(rule => svrUtil.docToObjectWithISODate(rule))).toEqual(res.body);
            const ruleNames = res.body.map(x => x.name);
            expect(ruleNames).toContain('E2ETESTDRV1-ROLL7');
            expect(ruleNames).toContain('E2ETESTDRV2-ROLL8');
            done();
          });
      });
  });

});


