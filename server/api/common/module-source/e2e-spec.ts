import {serverPromise} from '../../../server';
import request from 'supertest';
import _ from 'lodash';
import SourceRepo from '../source/repo';
import ModuleSourceRepo from './repo';

describe(`Module Source endpoint tests`, () => {
  let server, moduleSource, returnFromAddingSourceToAModule;
  const endpoint = '/api/module-source';
  const sourceRepo = new SourceRepo();
  const moduleSourceRepo = new ModuleSourceRepo();

  beforeAll(done => {
    serverPromise.then(_server => {
      server = _server;
      moduleSourceRepo.getOneByQuery({moduleId: 1})
        .then(doc => {
          moduleSource = doc;
          done();
        });
    });
  });

  afterAll(done => {
    moduleSourceRepo.update(moduleSource, moduleSource.updatedBy, false, false, false)
      .then(() => done());
  });

  it('should get many', done => {
    request(server)
      .get(endpoint)
      .expect(200)
      .end((err, res) => {
        const modulesSources = res.body;
        const moduleSources = _.find(modulesSources, {moduleId: 1});
        sourceRepo.getMany()
          .then(sources => {
            moduleSources.sources.forEach(id => expect(_.find(sources, {sourceId: id})).toBeDefined());
            done();
          });
      });
  });

  it(`should add a test source to a module`, done => {
    const testSourceToAddToModule = _.cloneDeep(moduleSource);
    testSourceToAddToModule.sources = [1001];
    request(server)
      .post(`${endpoint}/upsert`)
      .send(testSourceToAddToModule)
      .expect(200)
      .end(() => {
        moduleSourceRepo.getOneByQuery({moduleId: 1})
          .then(doc => {
            returnFromAddingSourceToAModule = doc;
            expect(doc.toObject().sources).toContain(testSourceToAddToModule.sources[0]);
            done();
          });
      });
  });

  it(`should remove a test source from a module`, done => {
    returnFromAddingSourceToAModule.sources = [];
    request(server)
      .post(`${endpoint}/upsert`)
      .send(returnFromAddingSourceToAModule)
      .expect(200)
      .end(() => {
        moduleSourceRepo.getOneByQuery({moduleId: 1})
          .then(doc => {
            expect(doc.toObject().sources).toEqual([]);
            done();
          });
      });
  });
});

