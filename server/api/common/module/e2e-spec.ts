import request from 'supertest';
import {serverPromise} from '../../../server';
import _ from 'lodash';
import {ModuleRepo} from './repo';

describe('Module endpoint tests', () => {
  let server;
  const endpoint = `/api/module`;
  const testModule = {
    displayOrder: 12,
    abbrev: 'test',
    name: 'Test Module - E2ETEST',
    desc: 'Module added during api e2e testing.',
    status: 'A'
  };
  let returnFromAddModule;
  beforeAll(function (done) {
    serverPromise.then(function (_server) {
      server = _server;
      done();
    });
  });

  it('should get many', done => {
    request(server)
      .get(endpoint)
      .expect(200)
      .end((err, res) => {
        new ModuleRepo().getManyWithRoles()
          .then(modules => {
            expect(_.sortBy(res.body.map(x => ({abbrev: x.abbrev, roleCount: x.roles.length})), 'abbrev'))
              .toEqual(_.sortBy(modules.map(x => ({abbrev: x.abbrev, roleCount: x.roles.length})), 'abbrev'));
            done();
          });
      });
  });

  it(`should add one`, (done) => {
    request(server)
      .post(endpoint)
      .send(testModule)
      .expect(200)
      .expect((res) => {
        returnFromAddModule = res.body;
        expect(returnFromAddModule).toBeDefined();
        Object.keys(testModule).forEach(key => expect(returnFromAddModule[key]).toEqual(testModule[key]));
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

  it(`should update one to inactive`, (done) => {
    returnFromAddModule.abbrev = 'itest';
    returnFromAddModule.name = 'Updated Test Module - E2ETEST';
    returnFromAddModule.desc = 'Module updated during api e2e testing.';
    returnFromAddModule.status = 'I';
    request(server)
      .put(`${endpoint}/${returnFromAddModule.id}`)
      .send(returnFromAddModule)
      .expect((res) => {
        expect(res.body.updatedDate).not.toEqual(returnFromAddModule.updatedDate);
        returnFromAddModule.updatedDate = res.body.updatedDate;
        expect(res.body).toEqual(returnFromAddModule);
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

  it(`should update one to active `, (done) => {
    returnFromAddModule.abbrev = 'atest';
    returnFromAddModule.status = 'A';
    request(server)
      .put(`${endpoint}/${returnFromAddModule.id}`)
      .send(returnFromAddModule)
      .expect((res) => {
        expect(res.body.updatedDate).not.toEqual(returnFromAddModule.updatedDate);
        returnFromAddModule.updatedDate = res.body.updatedDate;
        expect(res.body).toEqual(returnFromAddModule);
      })
      .end(done);
  });

  it(`should delete one`, (done) => {
    request(server)
      .delete(`${endpoint}/query-one`)
      .query({name: returnFromAddModule.name})
      .expect(200)
      .end(done);
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
