import {ModulePO} from './module.po';

describe(`Admin - Module Page`, () => {
  const modulePO = new ModulePO();
  const newTestModuleActive = {
    displayOrder : '12',
    abbrev : 'atst',
    name : 'New Active Test Module - E2ETEST',
    desc : `This module is added during testing.`,
    status : 'Active'
  };

  const newTestModuleInactive = {
    displayOrder : '13',
    abbrev : 'itst',
    name : 'New Inactive Test Module - E2ETEST',
    desc : `This module is added during testing.`,
    status : 'Inactive'
  };

  const existingModuleInDb = {
    displayOrder : '1',
    abbrev : 'prof',
    name : 'Profitability Allocations',
    desc : `This capability performs allocations at the multiple dimensions/hierarchies such as Sales Theater Level and Product Family Level used for Company's Profit/Loss (P/L) reporting to drive profitable growth.`,
    status : 'Active'
  };

  afterAll(done => {
    const url = '/api/module/query-one';
    Promise.all([
      modulePO.finJsonRequest(url, 'DELETE', undefined, {qs: {name: newTestModuleActive.name}}),
      modulePO.finJsonRequest(url, 'DELETE', undefined, {qs: {name: newTestModuleInactive.name}})
    ]).then(() => done());
  });

  beforeEach(() => {
    modulePO.navigateTo();
    modulePO.waitForModulesToLoad();
  });

  it(`should load all the modules`, () => {
    expect(modulePO.getModulesLoaded()).toBeGreaterThanOrEqual(11);
  });

  it(`should find module from search field`, () => {
    modulePO.getSearchField().sendKeys(existingModuleInDb.name);
    expect(modulePO.getFirstCellInARow().getText()).toEqual(existingModuleInDb.name);
    expect(modulePO.getCellRow().get(1).getText()).toEqual(existingModuleInDb.abbrev);
    expect(modulePO.getCellRow().get(2).getText()).toEqual(existingModuleInDb.displayOrder);
    expect(modulePO.getCellRow().last().getText()).toEqual(existingModuleInDb.status);
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
      expect(modulePO.isCheckBoxDisabled()).toBe(false);
      expect(modulePO.getCheckBoxLabel().getText()).toEqual(`Active`);
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
      expect(modulePO.getFormInputOnlyFields().first().getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFormInputOnlyFields().get(1).getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFormInputOnlyFields().get(2).getAttribute(`class`)).toContain('ng-invalid');
      modulePO.getFieldModuleName().sendKeys(newTestModuleActive.name);
      modulePO.getSubmitButton().click();
      expect(modulePO.getFormInputOnlyFields().get(1).getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFormInputOnlyFields().get(2).getAttribute(`class`)).toContain('ng-invalid');
      modulePO.getFieldModuleName().clear();
      modulePO.getFieldAbbreviation().sendKeys(newTestModuleActive.abbrev);
      modulePO.getSubmitButton().click();
      expect(modulePO.getFormInputOnlyFields().first().getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFormInputOnlyFields().get(2).getAttribute(`class`)).toContain('ng-invalid');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldDisplayOrder().sendKeys(newTestModuleActive.displayOrder);
      modulePO.getSubmitButton().click();
      expect(modulePO.getFormInputOnlyFields().first().getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFormInputOnlyFields().get(1).getAttribute(`class`)).toContain('ng-invalid');
    });

    it(`should show an error on the form field when the user adds a mandatory form field that already exists`, () => {
      modulePO.getAddButton().click();
      modulePO.waitForFormUp();
      modulePO.getFieldModuleName().sendKeys(existingModuleInDb.name);
      expect(modulePO.getErrorElementBlock(0).isDisplayed()).toBe(true);
      expect(modulePO.getErrorMessage(0)).toEqual('Value already exists');
      modulePO.getFieldAbbreviation().sendKeys(existingModuleInDb.abbrev);
      expect(modulePO.getErrorElementBlock(1).isDisplayed()).toBe(true);
      expect(modulePO.getErrorMessage(1)).toEqual('Value already exists');
      modulePO.getFieldDisplayOrder().sendKeys(existingModuleInDb.displayOrder);
      expect(modulePO.getErrorElementBlock(2).isDisplayed()).toBe(true);
      expect(modulePO.getErrorMessage(2)).toEqual('Value already exists');
    });

    it(`should show an error on the form field when the user adds a mandatory form field with incorrect value`, () => {
      modulePO.getAddButton().click();
      modulePO.waitForFormUp();
      modulePO.getFieldAbbreviation().sendKeys('a');
      expect(modulePO.getErrorElementBlock(1).isDisplayed()).toBe(true);
      expect(modulePO.getErrorMessage(1)).toEqual('Must be exactly 4 characters long');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldAbbreviation().sendKeys('ab');
      expect(modulePO.getErrorMessage(1)).toEqual('Must be exactly 4 characters long');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldAbbreviation().sendKeys('abc');
      expect(modulePO.getErrorMessage(1)).toEqual('Must be exactly 4 characters long');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldDisplayOrder().sendKeys('a');
      expect(modulePO.getErrorMessage(2)).toEqual('Not a number');
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
      expect(modulePO.getFirstCellInARow().getText()).toEqual(newTestModuleActive.name);
      expect(modulePO.getCellRow().get(1).getText()).toEqual(newTestModuleActive.abbrev);
      expect(modulePO.getCellRow().get(2).getText()).toEqual(newTestModuleActive.displayOrder);
      expect(modulePO.getCellRow().last().getText()).toEqual(newTestModuleActive.status);
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
      expect(modulePO.getFirstCellInARow().getText()).toEqual(newTestModuleInactive.name);
      expect(modulePO.getCellRow().get(1).getText()).toEqual(newTestModuleInactive.abbrev);
      expect(modulePO.getCellRow().get(2).getText()).toEqual(newTestModuleInactive.displayOrder);
      expect(modulePO.getCellRow().last().getText()).toEqual(newTestModuleInactive.status);
    });
  });

  describe(`Update Module Tests`, () => {
    it(`should show form with module values on clicking on the module name in table`, () => {
      modulePO.loadFormInEditModeForModule(existingModuleInDb.name);
      expect(modulePO.getFormTitle().getText()).toEqual(`Edit Module`);
      expect(modulePO.getFieldModuleName().getAttribute('value')).toEqual(existingModuleInDb.name);
      expect(modulePO.getFieldAbbreviation().getAttribute('value')).toEqual(existingModuleInDb.abbrev);
      expect(modulePO.getFieldDisplayOrder().getAttribute('value')).toEqual(existingModuleInDb.displayOrder);
      expect(modulePO.getFieldDescription().getAttribute('value')).toEqual(existingModuleInDb.desc);
      expect(modulePO.getStatusCheckBox().isEnabled()).toBe(true);
      expect(modulePO.isCheckBoxDisabled()).toBe(false);
      expect(modulePO.getCheckBoxLabel().getText()).toEqual(existingModuleInDb.status);
    });

    it(`should not allow the user to submit the form when updating source with mandatory fields empty`, () => {
      modulePO.loadFormInEditModeForModule(newTestModuleActive.name);
      modulePO.getFieldModuleName().clear();
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldDisplayOrder().clear();
      modulePO.getSubmitButton().click();
      expect(modulePO.getFormInputOnlyFields().first().getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFormInputOnlyFields().get(1).getAttribute(`class`)).toContain('ng-invalid');
      expect(modulePO.getFormInputOnlyFields().get(2).getAttribute(`class`)).toContain('ng-invalid');
      modulePO.pageRefresh();
      modulePO.loadFormInEditModeForModule(newTestModuleActive.name);
      modulePO.getFieldModuleName().clear();
      modulePO.getSubmitButton().click();
      expect(modulePO.getFormInputOnlyFields().first().getAttribute(`class`)).toContain('ng-invalid');
      modulePO.pageRefresh();
      modulePO.loadFormInEditModeForModule(newTestModuleActive.name);
      modulePO.getFieldAbbreviation().clear();
      modulePO.getSubmitButton().click();
      expect(modulePO.getFormInputOnlyFields().get(1).getAttribute(`class`)).toContain('ng-invalid');
      modulePO.pageRefresh();
      modulePO.loadFormInEditModeForModule(newTestModuleActive.name);
      modulePO.getFieldDisplayOrder().clear();
      modulePO.getSubmitButton().click();
      expect(modulePO.getFormInputOnlyFields().get(2).getAttribute(`class`)).toContain('ng-invalid');
    });

    it(`should show an error message when updating source with mandatory fields that already exist`, () => {
      modulePO.loadFormInEditModeForModule(newTestModuleActive.name);
      modulePO.getFieldModuleName().clear();
      modulePO.getFieldModuleName().sendKeys(existingModuleInDb.name);
      expect(modulePO.getErrorMessage(0)).toEqual('Value already exists');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldAbbreviation().sendKeys(existingModuleInDb.abbrev);
      expect(modulePO.getErrorMessage(1)).toEqual('Value already exists');
      modulePO.getFieldDisplayOrder().clear();
      modulePO.getFieldDisplayOrder().sendKeys(existingModuleInDb.displayOrder);
      expect(modulePO.getErrorMessage(2)).toEqual('Value already exists');
    });

    it(`should show an error message when updating source with mandatory fields that are invalid`, () => {
      modulePO.loadFormInEditModeForModule(newTestModuleActive.name);
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldAbbreviation().sendKeys('a');
      expect(modulePO.getErrorMessage(0)).toEqual('Must be exactly 4 characters long');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldAbbreviation().sendKeys('ab');
      expect(modulePO.getErrorMessage(0)).toEqual('Must be exactly 4 characters long');
      modulePO.getFieldAbbreviation().clear();
      modulePO.getFieldAbbreviation().sendKeys('abc');
      expect(modulePO.getErrorMessage(0)).toEqual('Must be exactly 4 characters long');
      modulePO.getFieldAbbreviation().clear();
      modulePO.pageRefresh();
      modulePO.loadFormInEditModeForModule(newTestModuleActive.name);
      modulePO.getFieldDisplayOrder().clear();
      modulePO.getFieldDisplayOrder().sendKeys('a');
      expect(modulePO.getErrorMessage(0)).toEqual('Not a number');
    });

    it(`should update an active module to inactive`, () => {
      modulePO.loadFormInEditModeForModule(newTestModuleActive.name);
      modulePO.getFieldDescription().clear();
      modulePO.getFieldDescription().sendKeys('Active Module added during testing made inactive');
      modulePO.getStatusCheckBox().click();
      modulePO.getSubmitButton().click();
      modulePO.waitForFormDown();
      modulePO.getSearchField().clear();
      modulePO.getSearchField().sendKeys(newTestModuleActive.name);
      expect(modulePO.getFirstCellInARow().getText()).toEqual(newTestModuleActive.name);
      expect(modulePO.getCellRow().get(1).getText()).toEqual(newTestModuleActive.abbrev);
      expect(modulePO.getCellRow().get(2).getText()).toEqual(newTestModuleActive.displayOrder);
      expect(modulePO.getCellRow().last().getText()).toEqual('Inactive');
    });

    it(`should update an Inactive module to active`, () => {
      modulePO.loadFormInEditModeForModule(newTestModuleInactive.name);
      modulePO.getFieldDescription().clear();
      modulePO.getFieldDescription().sendKeys('Inactive Module added during testing made active');
      modulePO.getStatusCheckBox().click();
      modulePO.getSubmitButton().click();
      modulePO.waitForFormDown();
      modulePO.getSearchField().clear();
      modulePO.getSearchField().sendKeys(newTestModuleInactive.name);
      expect(modulePO.getFirstCellInARow().getText()).toEqual(newTestModuleInactive.name);
      expect(modulePO.getCellRow().get(1).getText()).toEqual(newTestModuleInactive.abbrev);
      expect(modulePO.getCellRow().get(2).getText()).toEqual(newTestModuleInactive.displayOrder);
      expect(modulePO.getCellRow().last().getText()).toEqual('Active');
    });
  });
  });

