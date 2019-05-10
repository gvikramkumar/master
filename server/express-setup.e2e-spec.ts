import request from 'supertest';
import {serverPromise} from './server';

let server;
fdescribe('allocation rule tests', () => {

  beforeAll(function (done) {
    serverPromise.then(function (_server) {
      server = _server;
      done();
    });
  });

  it('shows endpoint not found', function (done) {
    request(server)
      .get('/notthere')
      .expect(404)
      .expect(function(res) {
        expect(res.body.message).toBe('Endpoint not found.');
      })
      .end(done);
  });


})


