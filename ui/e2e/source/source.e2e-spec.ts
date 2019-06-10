import {SourcePO} from './source.po';

describe(`Admin - Source Page`, () => {
  const sourcePO = new SourcePO();
  const newTestSource = {
    name: `Active Test Source - E2ETEST`,
    typeCode: 'ATEST',
    description: `Adding a new active test source`,
    status: 'Active'
  };

  const existingSourceInDb = {
    name: `Rapid Revenue`,
    typeCode: 'RRR',
    description: `Rapid Revenue Reporting Source`,
    status: 'Active'
  };

  const newSourceForUpdate = {
    name: 'Inactive Test Source - E2ETEST',
    typeCode: 'ITEST',
    description: 'Updated source to inactive',
    status: `Inactive`
  };

  afterAll(done => {
    sourcePO.finJsonRequest('/api/source/query-one', 'DELETE', undefined, {qs: {name: newSourceForUpdate.name}})
      .then(() => done());
  });


  beforeEach(() => {
    sourcePO.navigateTo();
    sourcePO.waitForSourcesToLoad();
  });

  it(`should load all the sources`, () => {
    expect(sourcePO.getSourcesLoaded()).toBeGreaterThanOrEqual(20);
  });


  it(`should find source from search field`, () => {
    sourcePO.getSearchField().sendKeys(existingSourceInDb.name);
    expect(sourcePO.getFirstCellInARow().getText()).toEqual(existingSourceInDb.name);
    expect(sourcePO.getCellRow().get(1).getText()).toEqual(existingSourceInDb.typeCode);
    expect(sourcePO.getCellRow().last().getText()).toEqual(existingSourceInDb.status);
  });
  
  describe(`Add Source Tests`, () => {
    it(`should show form on clicking add`, () => {
      sourcePO.getAddButton().click();
      sourcePO.waitForFormUp();
      expect(sourcePO.form.isPresent()).toBeTruthy();
      expect(sourcePO.getFormTitle().getText()).toEqual(`Add New Source`);
      expect(sourcePO.getFieldName().getAttribute('value')).toEqual(``);
      expect(sourcePO.getFieldTypeCode().getAttribute('value')).toEqual(``);
      expect(sourcePO.getFieldDescription().getAttribute('value')).toEqual(``);
      expect(sourcePO.getStatusCheckBox().isEnabled()).toBeTruthy();
      expect(sourcePO.isCheckBoxDisabled()).toBe(false);
      expect(sourcePO.getCheckBoxLabel().getText()).toEqual(`Active`);
      expect(sourcePO.checkIfSourceIsUsed()).toBeFalsy();
      expect(sourcePO.getSubmitButton().isPresent()).toBe(true);
      expect(sourcePO.getCancelButton().isPresent()).toBe(true);
    });

    it(`should close form on clicking cancel`, () => {
      sourcePO.getAddButton().click();
      sourcePO.waitForFormUp();
      sourcePO.getCancelButton().click();
      sourcePO.waitForFormDown();
      expect(sourcePO.form.isPresent()).toBeFalsy();
    });

    it(`should not allow the user to submit form with missing mandatory values`, () => {
      sourcePO.getAddButton().click();
      sourcePO.waitForFormUp();
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getFormInputOnlyFields().first().getAttribute(`class`)).toContain('ng-invalid');
      expect(sourcePO.getFormInputOnlyFields().get(1).getAttribute(`class`)).toContain('ng-invalid');
      sourcePO.getFieldName().sendKeys(newTestSource.name);
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getFormInputOnlyFields().get(1).getAttribute(`class`)).toContain('ng-invalid');
      sourcePO.getFieldName().clear();
      sourcePO.getFieldTypeCode().sendKeys(newTestSource.description);
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getFormInputOnlyFields().first().getAttribute(`class`)).toContain('ng-invalid');
    });

    it(`should show an error dialog when the user adds a mandatory source field that already exists`, () => {
      sourcePO.getAddButton().click();
      sourcePO.waitForFormUp();
      sourcePO.getFieldName().sendKeys(existingSourceInDb.name);
      sourcePO.getFieldTypeCode().sendKeys('TEST');
      sourcePO.getSubmitButton().click();
      sourcePO.waitForDialogToShow();
      expect(sourcePO.getDialogTitle().getText()).toEqual('Error');
      expect(sourcePO.getDialogMessage().getText()).toContain('duplicate key error');
      sourcePO.closeDialog();
      sourcePO.getFieldName().clear();
      sourcePO.getFieldTypeCode().clear();
      sourcePO.getFieldName().sendKeys(newTestSource.name);
      sourcePO.getFieldTypeCode().sendKeys(existingSourceInDb.typeCode);
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getDialogTitle().getText()).toEqual('Error');
      expect(sourcePO.getDialogMessage().getText()).toContain('duplicate key error');
    });

    it(`should add a new source with active status`, () => {
      sourcePO.getAddButton().click();
      sourcePO.waitForFormUp();
      sourcePO.getFieldName().sendKeys(newTestSource.name);
      sourcePO.getFieldTypeCode().sendKeys(newTestSource.typeCode);
      sourcePO.getFieldDescription().sendKeys(newTestSource.description);
      sourcePO.getStatusCheckBox().click();
      sourcePO.getSubmitButton().click();
      sourcePO.waitForFormDown();
      sourcePO.getSearchField().sendKeys(newTestSource.name);
      expect(sourcePO.getFirstCellInARow().getText()).toEqual(newTestSource.name);
      expect(sourcePO.getCellRow().get(1).getText()).toEqual(newTestSource.typeCode);
      expect(sourcePO.getCellRow().last().getText()).toEqual(newTestSource.status);
    });
  });

  describe('Update Source Tests', () => {
    it(`should show form with source values on clicking on the source name in table`, () => {
      sourcePO.loadFormInEditModeForSource(existingSourceInDb.name);
      expect(sourcePO.getFormTitle().getText()).toEqual(`Edit Source`);
      expect(sourcePO.getFieldName().getAttribute('value')).toEqual(existingSourceInDb.name);
      expect(sourcePO.getFieldTypeCode().getAttribute('value')).toEqual(existingSourceInDb.typeCode);
      expect(sourcePO.getFieldDescription().getAttribute('value')).toEqual(existingSourceInDb.description);
      expect(sourcePO.getStatusCheckBox().isEnabled()).toBe(true);
      expect(sourcePO.isCheckBoxDisabled()).toBe(true);
      expect(sourcePO.getCheckBoxLabel().getText()).toEqual(existingSourceInDb.status);
      expect(sourcePO.checkIfSourceIsUsed()).toBe(true);
    });

    it(`should not allow the user to submit the form when updating source with mandatory fields empty`, () => {
      sourcePO.loadFormInEditModeForSource(newTestSource.name);
      sourcePO.getFieldName().clear();
      sourcePO.getFieldTypeCode().clear();
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getFormInputOnlyFields().first().getAttribute(`class`)).toContain('ng-invalid');
      expect(sourcePO.getFormInputOnlyFields().get(1).getAttribute(`class`)).toContain('ng-invalid');
      sourcePO.pageRefresh();
      sourcePO.loadFormInEditModeForSource(newTestSource.name);
      sourcePO.getFieldName().clear();
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getFormInputOnlyFields().first().getAttribute(`class`)).toContain('ng-invalid');
      sourcePO.pageRefresh();
      sourcePO.loadFormInEditModeForSource(newTestSource.name);
      sourcePO.getFieldTypeCode().clear();
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getFormInputOnlyFields().get(1).getAttribute(`class`)).toContain('ng-invalid');
    });

    it(`should show an error dialog when updating source with mandatory fields that already exist`, () => {
      sourcePO.loadFormInEditModeForSource(newTestSource.name);
      sourcePO.getFieldName().clear();
      sourcePO.getFieldName().sendKeys(existingSourceInDb.name);
      sourcePO.getSubmitButton().click();
      sourcePO.waitForDialogToShow();
      expect(sourcePO.getDialogTitle().getText()).toEqual('Error');
      expect(sourcePO.getDialogMessage().getText()).toContain('duplicate key error');
      sourcePO.pageRefresh();
      sourcePO.loadFormInEditModeForSource(newTestSource.name);
      sourcePO.getFieldTypeCode().clear();
      sourcePO.getFieldTypeCode().sendKeys(existingSourceInDb.typeCode);
      sourcePO.getSubmitButton().click();
      sourcePO.waitForDialogToShow();
      expect(sourcePO.getDialogTitle().getText()).toEqual('Error');
      expect(sourcePO.getDialogMessage().getText()).toContain('duplicate key error');
    });

    it(`should update an existing source`, () => {
      sourcePO.loadFormInEditModeForSource(newTestSource.name);
      sourcePO.getFieldName().clear();
      sourcePO.getFieldName().sendKeys(newSourceForUpdate.name);
      sourcePO.getFieldTypeCode().clear();
      sourcePO.getFieldTypeCode().sendKeys(newSourceForUpdate.typeCode);
      sourcePO.getFieldDescription().clear();
      sourcePO.getFieldDescription().sendKeys(newSourceForUpdate.description);
      sourcePO.getStatusCheckBox().click();
      sourcePO.getSubmitButton().click();
      sourcePO.waitForFormDown();
      sourcePO.getSearchField().clear();
      sourcePO.getSearchField().sendKeys(newSourceForUpdate.name);
      expect(sourcePO.getFirstCellInARow().getText()).toEqual(newSourceForUpdate.name);
      expect(sourcePO.getCellRow().get(1).getText()).toEqual(newSourceForUpdate.typeCode);
      expect(sourcePO.getCellRow().last().getText()).toEqual(newSourceForUpdate.status);
    });

    it(`should show in use for source being used`, () => {
      sourcePO.loadFormInEditModeForSource(existingSourceInDb.name);
      expect(sourcePO.checkIfSourceIsUsed()).toBeTruthy();
    });
  });
});
