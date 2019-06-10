import request from 'supertest';
import {serverPromise} from '../../../server';
import _ from 'lodash';
import SourceRepo from './repo';

describe(`Source endpoint tests`, () => {
  const endpoint = '/api/source';
  let server, addSourceReturn, updateSourceReturn;
  const newSource = {
    name : 'Test - E2ETEST',
    desc : 'Test Source',
    typeCode : 'TEST',
    status : 'A'
  };
  beforeAll((done) => {
    serverPromise.then(_server => {
      server = _server;
      done();
    });
  });

  it(`should get many`, (done) => {
    request(server)
      .get(endpoint)
      .expect(200)
      .expect(function(res) {
        const arr = res.body;
        expect(arr.length).toBeGreaterThan(20);
      })
      .end(done);
  });

  it(`should add one`, (done) => {
    request(server)
      .post(`${endpoint}`)
      .send(newSource)
      .expect((res) => {
        addSourceReturn = res.body;
        expect(res.body.id).toBeTruthy();
        expect(res.body.sourceId).toBeTruthy();
        expect(res.body.name).toEqual(newSource.name);
      })
      .end(done);
  });


  it(`should get the added one`, (done) => {
    request(server)
      .get(`${endpoint}/${addSourceReturn.id}`)
      .expect(200, addSourceReturn)
      .end(done);
  });

  it(`should update one`, (done) => {
    const updatedSource = _.cloneDeep(addSourceReturn);
    updatedSource.name = 'Updated Test - E2ETEST';
    request(server)
      .put(`${endpoint}/${addSourceReturn.id}`)
      .send(updatedSource)
      .expect(200)
      .expect((res) => {
        updateSourceReturn = res.body;
        expect(res.body.id).toEqual(addSourceReturn.id);
        expect(res.body.name).not.toEqual(addSourceReturn.name);
        // Just for an example to show it waits for the promise to get fulfilled
       return new SourceRepo().getOneById(addSourceReturn.id).then(item => {
         expect(item.name).toEqual(updatedSource.name);
        });
      })
      .end(done);
  });

  it(`should get the updated one`, (done) => {
    request(server)
      .get(`${endpoint}/${updateSourceReturn.id}`)
      .expect(200, updateSourceReturn)
      .end(done);
  });

  it(`should get one by query`, (done) => {
    request(server)
      .get(`${endpoint}/query-one`)
      .query({sourceId: updateSourceReturn.sourceId})
      .expect((res) => {
        expect(res.body.id).toEqual(addSourceReturn.id);
      })
      .end(done);
  });

  it(`should delete one`, (done) => {
    request(server)
      .delete(`${endpoint}/query-one`)
      .query({name: updateSourceReturn.name})
      .expect(200)
      .end(done);
  });

  it(`should return 404 not found `, (done) => {
    request(server)
      .get(`${endpoint}/${addSourceReturn.id}`)
      .expect(404)
      .end(done);
  });
});
