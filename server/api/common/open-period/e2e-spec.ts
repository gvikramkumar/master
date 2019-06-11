import {serverPromise} from '../../../server';
import request from 'supertest';
import OpenPeriodRepo from './repo';
import _ from 'lodash';
import {svrUtil} from '../../../lib/common/svr-util';

describe(`Open Period endpoint tests`, () => {
  const endpoint = `/api/open-period`;
  const openPeriodRepo = new OpenPeriodRepo();
  let server;
  let testOpenPeriod = {
    moduleId: 12,
    fiscalMonth: 201909,
    openFlag: 'Y'
  };

  beforeAll(done => {
    serverPromise.then(_server => {
      server = _server;
      done();
    });
  });

  it(`should get many`, (done) => {
    request(server)
      .get(endpoint)
      .expect(200)
      .end((err, res) => {
        openPeriodRepo.getMany()
          .then(openPeriods => {
            expect(res.body).toEqual(openPeriods.map(x => svrUtil.docToObjectWithISODate(x)));
            done();
          });
      });
  });

  it(`should add an open period if the open period doesnt exist; else update open period if it exists`, (done) => {
     // adds first as the open period doesn't exist for moduleId - 12
    request(server)
      .post(`${endpoint}/upsert`)
      .send(testOpenPeriod)
      .expect(200)
      .end((err1, res1) => {
        testOpenPeriod = res1.body;
        openPeriodRepo.getMany()
          .then(openPeriodsAfterAdd => {
            const openPeriodAdded = _.find(openPeriodsAfterAdd, {moduleId: testOpenPeriod.moduleId});
            expect(testOpenPeriod).toEqual(svrUtil.docToObjectWithISODate(openPeriodAdded));

            // change the fiscalMonth
            testOpenPeriod.fiscalMonth = 201908;

            // It updates the open period now as we created it above
            request(server)
              .post(`${endpoint}/upsert`)
              .send(testOpenPeriod)
              .expect(200)
              .end((err2, res2) => {
                testOpenPeriod = res2.body;
                openPeriodRepo.getMany()
                  .then(openPeriodsAfterUpdate => {
                    const updatedOpenPeriod = _.find(openPeriodsAfterUpdate, {moduleId: testOpenPeriod.moduleId});
                    expect(testOpenPeriod).toEqual(svrUtil.docToObjectWithISODate(updatedOpenPeriod));
                    done();
                  });
              });
          });
      });
  });

  it(`should remove the open period`, done => {
    request(server)
      .delete(`${endpoint}/query-one`)
      .query({moduleId: testOpenPeriod.moduleId})
      .expect(200, done);
  });
});
