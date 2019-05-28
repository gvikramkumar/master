import request from 'supertest';
import {serverPromise} from '../../../server';
import OpenPeriodRepo from '../open-period/repo';
import _ from 'lodash';

describe('Module endpoint tests', () => {
  let server, openPeriodRepo;
  const endpoint = `/api/module`;
  const testModule = {
    displayOrder : 13,
    abbrev : 'test',
    name : 'Test Revenue Allocations',
    desc : 'Enables the detailed level allocations required to report holistic view of Product & Service Test Revenue for better predictability of test revenue growth and manage/support any new business models.',
    status : 'A'
  };
  let returnFromAddModule;
  beforeAll(function (done) {
    serverPromise.then(function (_server) {
      server = _server;
      openPeriodRepo = new OpenPeriodRepo();
      done();
    });
  });

  it('should get many', (done) => {
    request(server)
      .get(endpoint)
      .expect(200)
      .expect((res) => {
        const modules = res.body;
        expect(modules.map(module => module.name)).toEqual([
          'Administration',
          'TSS COGS Triangulation',
          'Bookings Misc Allocations',
          'Profitability Allocations',
          'AS COGS Allocations',
          'CIS COGS Allocations',
          'Bookings IR Allocations',
          'Service Triangulation',
          'Recurring Revenue',
          'OpEx Allocations',
          'Deferred Revenue Allocations',
          'Gross Unbilled Revenue']);
      })
      .end(done);
  });

  it(`should add one and add the open period`, (done) => {
    request(server)
      .post(endpoint)
      .send(testModule)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        Object.keys(testModule).forEach(key => expect(res.body[key]).toEqual(testModule[key]));
        openPeriodRepo.getOneByQuery({moduleId: res.body.moduleId})
          .then(item => expect(item.moduleId).toEqual(res.body.moduleId));
        returnFromAddModule = res.body;
      })
      .end(done);
  });

  it(`should get one`, (done) => {
    request(server)
      .get(`${endpoint}/${returnFromAddModule.id}`)
      .expect((res) => {
        expect(res.body).toEqual(returnFromAddModule);
      })
      .end(done);
  });

  it(`should update one to inactive and delete the open period`, (done) => {
    returnFromAddModule.abbrev = 'itest';
    returnFromAddModule.name = 'Updated Test Revenue Allocations to inactive';
    returnFromAddModule.status = 'I';
    request(server)
      .put(`${endpoint}/${returnFromAddModule.id}`)
      .send(returnFromAddModule)
      .expect((res) => {
        expect(res.body.updatedDate).not.toEqual(returnFromAddModule.updatedDate);
        returnFromAddModule.updatedDate = res.body.updatedDate;
        expect(res.body).toEqual(returnFromAddModule);
        openPeriodRepo.getMany({})
          .then(openPeriods => expect(_.find(openPeriods, {moduleId: returnFromAddModule.moduleId})).not.toBeDefined());
      })
      .end(done);
  });

  it('should get all active modules only sorted by display order', (done) => {
    request(server)
      .post(`${endpoint}/call-method/getActiveSortedByDisplayOrder`)
      .expect(200)
      .expect(res => {
        const activeModules = res.body;
        expect(_.find(activeModules, {moduleId: returnFromAddModule.moduleId})).not.toBeDefined();
        const activeNonAdminModules = activeModules.filter(mod => mod.moduleId !== 99);
        const arr = [];
        for (let i = 1; i <= activeNonAdminModules.length; i++) {
          arr.push(i);
        }
        expect(activeNonAdminModules.map(mod => mod.displayOrder)).toEqual(arr);
        expect(_.last(activeModules).displayOrder).toEqual(99);
      })
      .end(done);
  });

  it(`should update one to active and add the open period`, (done) => {
    returnFromAddModule.abbrev = 'atest';
    returnFromAddModule.name = 'Updated Test Revenue Allocations to active';
    returnFromAddModule.status = 'A';
    request(server)
      .put(`${endpoint}/${returnFromAddModule.id}`)
      .send(returnFromAddModule)
      .expect((res) => {
        expect(res.body.updatedDate).not.toEqual(returnFromAddModule.updatedDate);
        returnFromAddModule.updatedDate = res.body.updatedDate;
        expect(res.body).toEqual(returnFromAddModule);
        openPeriodRepo.getOneByQuery({moduleId: res.body.moduleId})
          .then(item => expect(item.moduleId).toEqual(res.body.moduleId));
      })
      .end(done);
  });

  it(`should delete one and delete open period if the module state is active`, (done) => {
    request(server)
      .delete(`${endpoint}/${returnFromAddModule.id}`)
      .expect(200)
      .expect((res) => {
        openPeriodRepo.getMany({})
          .then(openPeriods => expect(_.find(openPeriods, {moduleId: returnFromAddModule.moduleId})).not.toBeDefined());
      }).end(done);
  });

  it(`should return 404 not found`, (done) => {
    request(server)
      .get(`${endpoint}/${returnFromAddModule.id}`)
      .expect(404, done);
  });

  it(`should get all non admin modules sorted by displayOrder`, (done) => {
    request(server)
      .post(`${endpoint}/call-method/getNonAdminSortedByDisplayOrder`)
      .expect(res => {
        const modules = res.body;
        const adminModule = modules.filter(module => module.name === 'Administration');
        expect(adminModule.length).toBeFalsy();
        const arr = [];
        for (let i = 1; i <= modules.length; i++) {
          arr.push(i);
        }
        expect(modules.map(mod => mod.displayOrder)).toEqual(arr);
      })
      .end(done);
  });
});
