import {ModulePO} from './module.po';

describe(`Admin - Module Page`, () => {
  const url = '/api/module';
  let existingModulesInDb;
  let existingModuleInDb;
  const modulePO = new ModulePO();
  const newTestModuleActive: any = {
    abbrev : 'atst',
    name : 'New Active Test Module - E2ETEST',
    desc : `This module is added during testing.`,
    status : 'Active'
  };

  const newTestModuleInactive: any = {
    abbrev : 'itst',
    name : 'New Inactive Test Module - E2ETEST',
    desc : `This module is added during testing.`,
    status : 'Inactive'
  };

  beforeAll(done => {
    modulePO.finJsonRequest(`${url}/call-method/getNonAdminSortedByDisplayOrder`, 'POST', undefined, {moduleId: 1})
      .then(result => {
        existingModulesInDb = result.body;
        existingModuleInDb = existingModulesInDb[0];
        let highestDisplayOrderForSavedModules = Number(existingModulesInDb.map(x => x.displayOrder).sort((a, b) => b - a)[0]);
        newTestModuleActive['displayOrder'] = ++highestDisplayOrderForSavedModules;
        newTestModuleInactive['displayOrder'] = ++highestDisplayOrderForSavedModules;
        done();
      });
  });

  afterAll(done => {
    Promise.all([
      modulePO.finJsonRequest(`${url}/query-one`, 'DELETE', undefined, {name: newTestModuleActive.name}),
      modulePO.finJsonRequest(`${url}/query-one`, 'DELETE', undefined, {name: newTestModuleInactive.name})
    ]).then(() => done());
  });

  beforeEach(() => {
    modulePO.navigateTo();
  });

  it(`should load all the modules`, () => {
    expect(modulePO.getCountOfItemsLoadedInTheTable()).toEqual(existingModulesInDb.length);
  });

  it(`should find module from search field`, () => {
    modulePO.getSearchField().sendKeys(existingModuleInDb.name);
    expect(modulePO.getFirstCellInFirstRow().getText()).toEqual(existingModuleInDb.name);
    expect(modulePO.getTableRows().get(1).getText()).toEqual(existingModuleInDb.abbrev);
    modulePO.getTableRows().get(2).getText().then(text => expect(Number(text)).toEqual(existingModuleInDb.displayOrder));
    expect(modulePO.getTableRows().last().getText()).toEqual(existingModuleInDb.status === 'A' ? 'Active' : 'Inactive');
  });

  describe(`Add Module Tests`, () => {
    it(`should show form on clicking add`, () => {
      modulePO.getAddButton().click();
      modulePO.waitForFormUp();
      expect(modulePO.form.isPresent()).toBeTruthy();
      expect(modulePO.getFormTitle().getText()).toEqual(`Add New Module`);
      expect(modulePO.getFieldModuleName().getAttribute('value')).toEqual(``);
      expect(modulePO.getFieldAbbreviation().getAttribute('value')).toEqual(``);
      expect(modulePO.getFieldDisplayOrder().getAttribute('value')).toEqual(``);
      expect(modulePO.getFieldDescription().getAttribute('value')).toEqual(``);
      expect(modulePO.getStatusCheckBox().isEnabled()).toBeTruthy();
      expect(modulePO.isStatusCheckBoxDisabled()).toBe(false);
      expect(modulePO.getStatusCheckBoxLabel()).toEqual(`Active`);
      expect(modulePO.getSubmitButton().isPresent()).toBe(true);
      expect(modulePO.getCancelButton().isPresent()).toBe(true);
    });

    it(`should close form on clicking cancel`, () => {
      modulePO.getAddButton().click();
      modulePO.waitForFormUp();
      modulePO.getCancelButton().click();
      modulePO.waitForFormDown();
      expect(modulePO.form.isPresent()).toBeFalsy();
    });

    it(`should not allow the user to submit form with missing mandatory values`, () => {
      modulePO.getAddButton().click();
      modulePO.waitForFormUp();
      modulePO.getSubmitButton().click();
      expect(modulePO.getFieldModuleName(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFieldAbbreviation(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFieldDisplayOrder(true).getAttribute(`class`)).toContain('ng-invalid');
      modulePO.getFieldModuleName().sendKeys(newTestModuleActive.name);
      modulePO.getSubmitButton().click();
      expect(modulePO.getFieldAbbreviation(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFieldDisplayOrder(true).getAttribute(`class`)).toContain('ng-invalid');
      modulePO.getFieldModuleName().clear();
      modulePO.getFieldAbbreviation().sendKeys(newTestModuleActive.abbrev);
      modulePO.getSubmitButton().click();
      expect(modulePO.getFieldModuleName(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFieldDisplayOrder(true).getAttribute(`class`)).toContain('ng-invalid');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldDisplayOrder().sendKeys(newTestModuleActive.displayOrder);
      modulePO.getSubmitButton().click();
      expect(modulePO.getFieldModuleName(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFieldAbbreviation(true).getAttribute(`class`)).toContain('ng-invalid');
    });

    it(`should show an error on the form field when the user adds a mandatory form field that already exists`, () => {
      modulePO.getAddButton().click();
      modulePO.waitForFormUp();
      modulePO.getFieldModuleName().sendKeys(existingModuleInDb.name);
      expect(modulePO.getErrorMessageForModuleName()).toEqual('Value already exists');
      modulePO.getFieldAbbreviation().sendKeys(existingModuleInDb.abbrev);
      expect(modulePO.getErrorMessageForAbbreviation()).toEqual('Value already exists');
      modulePO.getFieldDisplayOrder().sendKeys(existingModuleInDb.displayOrder);
      expect(modulePO.getErrorMessageForDisplayOrder()).toEqual('Value already exists');
    });

    it(`should show an error on the form field when the user adds a mandatory form field with incorrect value`, () => {
      modulePO.getAddButton().click();
      modulePO.waitForFormUp();
      modulePO.getFieldAbbreviation().sendKeys('a');
      expect(modulePO.getErrorMessageForAbbreviation()).toEqual('Must be exactly 4 characters long');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldAbbreviation().sendKeys('ab');
      expect(modulePO.getErrorMessageForAbbreviation()).toEqual('Must be exactly 4 characters long');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldAbbreviation().sendKeys('abc');
      expect(modulePO.getErrorMessageForAbbreviation()).toEqual('Must be exactly 4 characters long');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldDisplayOrder().sendKeys('a');
      expect(modulePO.getErrorMessageForDisplayOrder()).toEqual('Not a number');
    });

    it(`should add a new module with active status`, () => {
      modulePO.getAddButton().click();
      modulePO.waitForFormUp();
      modulePO.getFieldModuleName().sendKeys(newTestModuleActive.name);
      modulePO.getFieldAbbreviation().sendKeys(newTestModuleActive.abbrev);
      modulePO.getFieldDisplayOrder().sendKeys(newTestModuleActive.displayOrder);
      modulePO.getFieldDescription().sendKeys(newTestModuleActive.desc);
      modulePO.getStatusCheckBox().click();
      modulePO.getSubmitButton().click();
      modulePO.waitForFormDown();
      modulePO.getSearchField().sendKeys(newTestModuleActive.name);
      expect(modulePO.getFirstCellInFirstRow().getText()).toEqual(newTestModuleActive.name);
      expect(modulePO.getTableRows().get(1).getText()).toEqual(newTestModuleActive.abbrev);
      modulePO.getTableRows().get(2).getText().then(text => expect(Number(text)).toEqual(newTestModuleActive.displayOrder));
      expect(modulePO.getTableRows().last().getText()).toEqual(newTestModuleActive.status);
    });

    it(`should add a new module with inactive status`, () => {
      modulePO.getAddButton().click();
      modulePO.waitForFormUp();
      modulePO.getFieldModuleName().sendKeys(newTestModuleInactive.name);
      modulePO.getFieldAbbreviation().sendKeys(newTestModuleInactive.abbrev);
      modulePO.getFieldDisplayOrder().sendKeys(newTestModuleInactive.displayOrder);
      modulePO.getFieldDescription().sendKeys(newTestModuleInactive.desc);
      modulePO.getSubmitButton().click();
      modulePO.waitForFormDown();
      modulePO.getSearchField().sendKeys(newTestModuleInactive.name);
      expect(modulePO.getFirstCellInFirstRow().getText()).toEqual(newTestModuleInactive.name);
      expect(modulePO.getTableRows().get(1).getText()).toEqual(newTestModuleInactive.abbrev);
      modulePO.getTableRows().get(2).getText().then(text => expect(Number(text)).toEqual(newTestModuleInactive.displayOrder));
      expect(modulePO.getTableRows().last().getText()).toEqual(newTestModuleInactive.status);
    });
  });

  describe(`Update Module Tests`, () => {
    it(`should show form with module values on clicking on the module name in table`, () => {
      modulePO.loadFormInEditMode(existingModuleInDb.name);
      expect(modulePO.getFormTitle().getText()).toEqual(`Edit Module`);
      expect(modulePO.getFieldModuleName().getAttribute('value')).toEqual(existingModuleInDb.name);
      expect(modulePO.getFieldAbbreviation().getAttribute('value')).toEqual(existingModuleInDb.abbrev);
      modulePO.getFieldDisplayOrder().getAttribute('value').then(text => expect(Number(text)).toEqual(existingModuleInDb.displayOrder));
      expect(modulePO.getFieldDescription().getAttribute('value')).toEqual(existingModuleInDb.desc);
      expect(modulePO.getStatusCheckBox().isEnabled()).toBe(true);
      expect(modulePO.isStatusCheckBoxDisabled()).toBe(false);
    });

    it(`should not allow the user to submit the form when updating module with mandatory fields empty`, () => {
      modulePO.loadFormInEditMode(newTestModuleActive.name);
      modulePO.getFieldModuleName().clear();
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldDisplayOrder().clear();
      modulePO.getSubmitButton().click();
      expect(modulePO.getFieldModuleName(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFieldAbbreviation(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFieldDisplayOrder(true).getAttribute(`class`)).toContain('ng-invalid');
      modulePO.pageRefresh();
      modulePO.loadFormInEditMode(newTestModuleActive.name);
      modulePO.getFieldModuleName().clear();
      modulePO.getSubmitButton().click();
      expect(modulePO.getFieldModuleName(true).getAttribute(`class`)).toContain('ng-invalid');
      modulePO.pageRefresh();
      modulePO.loadFormInEditMode(newTestModuleActive.name);
      modulePO.getFieldAbbreviation().clear();
      modulePO.getSubmitButton().click();
      expect(modulePO.getFieldAbbreviation(true).getAttribute(`class`)).toContain('ng-invalid');
      modulePO.pageRefresh();
      modulePO.loadFormInEditMode(newTestModuleActive.name);
      modulePO.getFieldDisplayOrder().clear();
      modulePO.getSubmitButton().click();
      expect(modulePO.getFieldDisplayOrder(true).getAttribute(`class`)).toContain('ng-invalid');
    });

    it(`should show an error message when updating module with mandatory fields that already exist`, () => {
      modulePO.loadFormInEditMode(newTestModuleActive.name);
      modulePO.getFieldModuleName().clear();
      modulePO.getFieldModuleName().sendKeys(existingModuleInDb.name);
      expect(modulePO.getErrorMessageForModuleName()).toEqual('Value already exists');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldAbbreviation().sendKeys(existingModuleInDb.abbrev);
      expect(modulePO.getErrorMessageForAbbreviation()).toEqual('Value already exists');
      modulePO.getFieldDisplayOrder().clear();
      modulePO.getFieldDisplayOrder().sendKeys(existingModuleInDb.displayOrder);
      expect(modulePO.getErrorMessageForDisplayOrder()).toEqual('Value already exists');
    });

    it(`should show an error message when updating module with mandatory fields that are invalid`, () => {
      modulePO.loadFormInEditMode(newTestModuleActive.name);
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldAbbreviation().sendKeys('a');
      expect(modulePO.getErrorMessageForAbbreviation()).toEqual('Must be exactly 4 characters long');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldAbbreviation().sendKeys('ab');
      expect(modulePO.getErrorMessageForAbbreviation()).toEqual('Must be exactly 4 characters long');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldAbbreviation().sendKeys('abc');
      expect(modulePO.getErrorMessageForAbbreviation()).toEqual('Must be exactly 4 characters long');
      modulePO.getFieldAbbreviation().clear();
      modulePO.pageRefresh();
      modulePO.loadFormInEditMode(newTestModuleActive.name);
      modulePO.getFieldDisplayOrder().clear();
      modulePO.getFieldDisplayOrder().sendKeys('a');
      expect(modulePO.getErrorMessageForDisplayOrder()).toEqual('Not a number');
    });

    it(`should update an active module to inactive`, () => {
      modulePO.loadFormInEditMode(newTestModuleActive.name);
      modulePO.getFieldDescription().clear();
      modulePO.getFieldDescription().sendKeys('Active Module added during testing made inactive');
      modulePO.getStatusCheckBox().click();
      modulePO.getSubmitButton().click();
      modulePO.waitForFormDown();
      modulePO.getSearchField().clear();
      modulePO.getSearchField().sendKeys(newTestModuleActive.name);
      expect(modulePO.getFirstCellInFirstRow().getText()).toEqual(newTestModuleActive.name);
      expect(modulePO.getTableRows().get(1).getText()).toEqual(newTestModuleActive.abbrev);
      modulePO.getTableRows().get(2).getText().then(text => expect(Number(text)).toEqual(newTestModuleActive.displayOrder));
      expect(modulePO.getTableRows().last().getText()).toEqual('Inactive');
    });

    it(`should update an Inactive module to active`, () => {
      modulePO.loadFormInEditMode(newTestModuleInactive.name);
      modulePO.getFieldDescription().clear();
      modulePO.getFieldDescription().sendKeys('Inactive Module added during testing made active');
      modulePO.getStatusCheckBox().click();
      modulePO.getSubmitButton().click();
      modulePO.waitForFormDown();
      modulePO.getSearchField().clear();
      modulePO.getSearchField().sendKeys(newTestModuleInactive.name);
      expect(modulePO.getFirstCellInFirstRow().getText()).toEqual(newTestModuleInactive.name);
      expect(modulePO.getTableRows().get(1).getText()).toEqual(newTestModuleInactive.abbrev);
      modulePO.getTableRows().get(2).getText().then(text => expect(Number(text)).toEqual(newTestModuleInactive.displayOrder));
      expect(modulePO.getTableRows().last().getText()).toEqual('Active');
    });
  });
  });

