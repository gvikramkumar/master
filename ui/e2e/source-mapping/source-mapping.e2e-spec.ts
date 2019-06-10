import {SourceMappingPO} from './source-mapping.po';

describe(`Admin - Source Mapping page`, () => {
  const srcMapPO = new SourceMappingPO();
  const testModule = {
    displayOrder : '12',
    abbrev : 'atst',
    name : 'Test Module - E2ETEST',
    desc : `This module is added during testing.`,
    status : 'Active'
  };
  const testSource = {
    name: `Test Source - E2ETEST`,
    typeCode: 'ATEST',
    description: `Adding a new active test source`,
    status: 'Active'
  };

  beforeAll(done => {
    Promise.all([
      srcMapPO.finJsonRequest('/api/module', 'POST', testModule),
      srcMapPO.finJsonRequest('/api/source', 'POST', testSource)
    ])
      .then(() => {
        srcMapPO.navigateTo();
        srcMapPO.waitForPageToLoad();
        done();
      });
  });

  afterAll(done => {
    Promise.all([
      srcMapPO.finJsonRequest('/api/module', 'DELETE', undefined, {qs: {name: testModule.name}}),
      srcMapPO.finJsonRequest('/api/source', 'DELETE', undefined, {qs: {name: testSource.name}}),
    ])
      .then(() => done());
  });

  it(`should load all the active modules`, () => {
    expect(srcMapPO.getActiveModules().count()).toBeGreaterThanOrEqual(11);
  });

  it(`should add a test source to a module`, () => {
    srcMapPO.getSelectForModule(11).sendKeys(testSource.name);
    srcMapPO.getSelectCheckbox().click();
    srcMapPO.getSubmitButton().click();


  });

});
