import request from 'supertest';
import {serverPromise} from '../../../server';

let server;
describe('allocation rule tests', () => {

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

});


