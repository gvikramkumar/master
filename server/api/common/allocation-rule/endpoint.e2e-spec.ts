import request from 'supertest';
import {serverPromise} from '../../../server';

let server;
fdescribe('allocation rule tests', () => {

  beforeAll(function (done) {
    serverPromise.then(function (_server) {
      server = _server;
      done();
    });
  });

  it('should get many', function (done) {
    request(server)
      .get('/api/allocation-rule?moduleId=1')
      .expect(function(res) {
        const arr = res.body;
        expect(arr.length).toBe(3);
        expect(arr.map(x => x.name).sort()).toEqual(['2TSUBDIR-MTD', 'GLREVMIX-ROLL3', 'SHIPREV-QTD']);
      })
      .end(done);
  });

  it('should get one', function (done) {
    request(server)
      .get('/api/allocation-rule/5cc830e9fa6d247f5496638f')
      .expect(200)
      .expect(function(res) {
        const rule = res.body;
        expect(rule.name).toEqual('RULE1');
      })
      .end(done);
  });

})


