import {SourceMappingPO} from './source-mapping.po';

describe(`Admin - Source Mapping page`, () => {
  const srcMapPO = new SourceMappingPO();
  const testModule = {
    displayOrder: '12',
    abbrev: 'atst',
    name: 'Test Module - E2ETEST',
    desc: `This module is added during testing.`,
    status: 'A'
  };
  const testSource = {
    name: `Test Source - E2ETEST`,
    typeCode: 'TEST1',
    description: `Adding a new active test source`,
    status: 'A'
  };

  const testSource2 = {
    name: `Test Source2 - E2ETEST`,
    typeCode: 'TEST2',
    description: `Adding a new active test2 source`,
    status: 'A'
  };

  beforeAll(done => {
    Promise.all([
      srcMapPO.finJsonRequest('/api/module', 'POST', testModule, undefined),
      srcMapPO.finJsonRequest('/api/source', 'POST', testSource, undefined)
    ])
      .then(() => done());
  });

  afterAll(done => {
    Promise.all([
      srcMapPO.finJsonRequest('/api/module/query-one', 'DELETE', undefined, {name: testModule.name}),
      srcMapPO.finJsonRequest('/api/source/query-one', 'DELETE', undefined, {name: testSource.name}),
      srcMapPO.finJsonRequest('/api/source/query-one', 'DELETE', undefined, {name: testSource2.name})
    ])
      .then((results: any) => {
        const deletedModule = results[0].body;
        srcMapPO.finJsonRequest('/api/module-source/query-one', 'DELETE', undefined, {moduleId: deletedModule.moduleId})
          .then(() => done());
      });
  });

  beforeEach(() => {
    srcMapPO.navigateTo();
  });

  it(`should load all the active modules`, () => {
    expect(srcMapPO.getActiveModules().count()).toBeGreaterThanOrEqual(11);
  });

  it(`should add a test source to a module`, () => {
    srcMapPO.getSelectInputForModule(11).sendKeys(testSource.name);
    srcMapPO.getSelectCheckbox().click();
    srcMapPO.getSubmitButton().click();
    srcMapPO.getSelectInputForModule(11).clear();
    srcMapPO.getSelectInputForModule(11).sendKeys(testSource.name);
    srcMapPO.waitForDropdownToShow();
    expect(srcMapPO.checkIfCheckboxIsChecked()).toEqual('true');
  });

  it(`should remove a test source mapped to a module`, () => {
    srcMapPO.getSelectInputForModule(11).clear();
    srcMapPO.getSelectInputForModule(11).sendKeys(testSource.name);
    srcMapPO.getSelectCheckbox().click();
    srcMapPO.getSubmitButton().click();
    srcMapPO.getSelectInputForModule(11).clear();
    srcMapPO.getSelectInputForModule(11).sendKeys(testSource.name);
    srcMapPO.waitForDropdownToShow();
    expect(srcMapPO.checkIfCheckboxIsChecked()).toEqual(null);
  });

  describe('multiple items', () => {
    beforeAll(done => {
      srcMapPO.finJsonRequest('/api/source', 'POST', testSource2, undefined)
        .then(() => done());
    });

    it(`should add multiple test sources to a module`, () => {
      srcMapPO.getSelectInputForModule(11).sendKeys(testSource.name);
      srcMapPO.getSelectCheckbox().click();
      srcMapPO.getSelectInputForModule(11).clear();
      srcMapPO.getSelectInputForModule(11).sendKeys(testSource2.name);
      srcMapPO.getSelectCheckbox().click();
      srcMapPO.getSubmitButton().click();
      srcMapPO.getSelectInputForModule(11).clear();
      srcMapPO.getSelectInputForModule(11).sendKeys(testSource.name);
      srcMapPO.waitForDropdownToShow();
      expect(srcMapPO.checkIfCheckboxIsChecked()).toEqual('true');
      srcMapPO.getSelectInputForModule(11).clear();
      srcMapPO.getSelectInputForModule(11).sendKeys(testSource2.name);
      srcMapPO.waitForDropdownToShow();
      expect(srcMapPO.checkIfCheckboxIsChecked()).toEqual('true');
    });

    it(`should remove multiple test sources mapped to a module`, () => {
      srcMapPO.getSelectInputForModule(11).clear();
      srcMapPO.getSelectInputForModule(11).sendKeys(testSource.name);
      srcMapPO.getSelectCheckbox().click();
      srcMapPO.getSelectInputForModule(11).clear();
      srcMapPO.getSelectInputForModule(11).sendKeys(testSource2.name);
      srcMapPO.getSelectCheckbox().click();
      srcMapPO.getSubmitButton().click();
      srcMapPO.getSelectInputForModule(11).clear();
      srcMapPO.getSelectInputForModule(11).sendKeys(testSource.name);
      srcMapPO.waitForDropdownToShow();
      expect(srcMapPO.checkIfCheckboxIsChecked()).toEqual(null);
      srcMapPO.getSelectInputForModule(11).clear();
      srcMapPO.getSelectInputForModule(11).sendKeys(testSource2.name);
      srcMapPO.waitForDropdownToShow();
      expect(srcMapPO.checkIfCheckboxIsChecked()).toEqual(null);
    });
  });
});
