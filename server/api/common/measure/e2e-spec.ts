import request from 'supertest';
import {serverPromise} from '../../../server';
import MeasureRepo from './repo';
import {svrUtil} from '../../../lib/common/svr-util';
import AnyObj from '../../../../shared/models/any-obj';
import * as _ from 'lodash';

fdescribe(`Measure endpoint tests`, () => {
  let server;
  const endpoint = '/api/measure';
  const measureRepo = new MeasureRepo();
  let testMeasure: AnyObj = {
    moduleId: 1,
    name: 'Test Measure - E2ETEST',
    typeCode: 'test',
    sources: [1],
    hierarchies: ['PRODUCT'],
    status: 'A'
  };
  beforeAll(done => {
    serverPromise.then(_server => {
      server = _server;
      done();
    });
  });

  it(`should get many`, done => {
    request(server)
      .get(endpoint)
      .query({moduleId: 1})
      .expect(200)
      .end((err, res) => {
        measureRepo.getMany({moduleId: 1})
          .then(measures => {
            expect(measures.map(ms => svrUtil.docToObjectWithISODate(ms))).toEqual(res.body);
            done();
          });
      });
  });

  it(`should add one`, done => {
    request(server)
      .post(endpoint)
      .send(testMeasure)
      .expect(200)
      .end((err, res) => {
        testMeasure = res.body;
        measureRepo.getMany({moduleId: 1})
          .then(measures => {
            const measure = measures.filter(m => m.id === testMeasure.id)[0];
            expect(measure).toBeDefined();
            expect(svrUtil.docToObjectWithISODate(measure)).toEqual(testMeasure);
            done();
          });
      });
  });

  it(`should get one by query`, done => {
    request(server)
      .get(`${endpoint}/query-one`)
      .query({name: testMeasure.name})
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual(testMeasure);
      })
      .end(done);
  });

  it(`should get one by id`, done => {
    request(server)
      .get(`${endpoint}/${testMeasure.id}`)
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual(testMeasure);
      })
      .end(done);
    });

  it(`should update one`, done => {
    testMeasure.status = 'I';
    request(server)
      .put(`${endpoint}/${testMeasure.id}`)
      .send(testMeasure)
      .expect(200)
      .end((err, res) => {
        testMeasure = res.body;
        measureRepo.getMany({moduleId: 1})
          .then(measures => {
            const measure = measures.filter(m => m.id === testMeasure.id)[0];
            expect(measure).toBeDefined();
            expect(svrUtil.docToObjectWithISODate(measure)).toEqual(testMeasure);
            done();
          });
      });
  });

  it(`should delete one by id`, done => {
    request(server)
      .delete(`${endpoint}/${testMeasure.id}`)
      .expect(200)
      .end(() => {
        measureRepo.getMany({moduleId: 1})
          .then(measures => {
            expect(_.includes(measures, testMeasure.id)).toEqual(false);
            done();
          });
      });
  });
});
