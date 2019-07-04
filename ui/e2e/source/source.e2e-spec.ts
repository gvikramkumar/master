import {SourcePO} from './source.po';
import * as _ from 'lodash';

describe(`Admin - Source Page`, () => {
  const url = '/api/source';
  let existingSourcesInDb, existingSourceInDb;
  const sourcePO = new SourcePO();

  const newTestSource = {
    name: `Test Source - E2ETEST`,
    typeCode: 'TEST',
    description: `Adding a new active test source`,
    status: 'A'
  };


  beforeAll(done => {
    sourcePO.finJsonRequest(url, 'GET', undefined, undefined)
      .then(result => {
        existingSourcesInDb = result.body;
        existingSourceInDb = existingSourcesInDb[0];
        done();
      });
  });

  afterAll(done => {
    sourcePO.finJsonRequest('/api/source/query-one', 'DELETE', undefined, {name: newTestSource.name})
      .then(() => done());
  });


  beforeEach(() => {
    sourcePO.navigateTo();
  });

  it(`should load all the sources`, () => {
    expect(sourcePO.getCountOfItemsLoadedInTheTable()).toEqual(existingSourcesInDb.length);
  });


  it(`should find source from search field`, () => {
    sourcePO.getSearchField().sendKeys(existingSourceInDb.name);
    expect(sourcePO.getFirstCellInFirstRow().getText()).toEqual(existingSourceInDb.name);
    expect(sourcePO.getTableRows().get(1).getText()).toEqual(existingSourceInDb.typeCode);
    expect(sourcePO.getTableRows().last().getText()).toEqual(existingSourceInDb.status === 'A' ? 'Active' : 'Inactive');
  });
  
  describe(`Add Source Tests`, () => {
    it(`should show form on clicking add`, () => {
      sourcePO.getAddButton().click();
      sourcePO.waitForFormUp();
      expect(sourcePO.form.isPresent()).toBeTruthy();
      expect(sourcePO.getFormTitle().getText()).toEqual(`Add New Source`);
      expect(sourcePO.getFieldSourceName().getAttribute('value')).toEqual(``);
      expect(sourcePO.getFieldTypeCode().getAttribute('value')).toEqual(``);
      expect(sourcePO.getFieldDescription().getAttribute('value')).toEqual(``);
      expect(sourcePO.getStatusCheckBox().isEnabled()).toBeTruthy();
      expect(sourcePO.isStatusCheckBoxDisabled()).toBe(false);
      expect(sourcePO.getStatusCheckBoxLabel()).toEqual(`Active`);
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
      sourcePO.getFieldSourceName().sendKeys(newTestSource.name);
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getFormInputOnlyFields().get(1).getAttribute(`class`)).toContain('ng-invalid');
      sourcePO.getFieldSourceName().clear();
      sourcePO.getFieldTypeCode().sendKeys(newTestSource.description);
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getFormInputOnlyFields().first().getAttribute(`class`)).toContain('ng-invalid');
    });

    it(`should show an error dialog when the user adds a mandatory source field that already exists`, () => {
      sourcePO.getAddButton().click();
      sourcePO.waitForFormUp();
      sourcePO.getFieldSourceName().sendKeys(existingSourceInDb.name);
      sourcePO.getFieldTypeCode().sendKeys(newTestSource.typeCode);
      sourcePO.getSubmitButton().click();
      sourcePO.waitForDialogToShow();
      expect(sourcePO.getDialogTitle()).toEqual('Error');
      expect(sourcePO.getDialogMessage()).toContain('duplicate key error');
      sourcePO.closeDialog();
      sourcePO.getFieldSourceName().clear();
      sourcePO.getFieldTypeCode().clear();
      sourcePO.getFieldSourceName().sendKeys(newTestSource.name);
      sourcePO.getFieldTypeCode().sendKeys(existingSourceInDb.typeCode);
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getDialogTitle()).toEqual('Error');
      expect(sourcePO.getDialogMessage()).toContain('duplicate key error');
    });

    it(`should add a new source with active status`, () => {
      sourcePO.getAddButton().click();
      sourcePO.waitForFormUp();
      sourcePO.getFieldSourceName().sendKeys(newTestSource.name);
      sourcePO.getFieldTypeCode().sendKeys(newTestSource.typeCode);
      sourcePO.getFieldDescription().sendKeys(newTestSource.description);
      sourcePO.getStatusCheckBox().click();
      sourcePO.getSubmitButton().click();
      sourcePO.waitForFormDown();
      sourcePO.getSearchField().sendKeys(newTestSource.name);
      expect(sourcePO.getFirstCellInFirstRow().getText()).toEqual(newTestSource.name);
      expect(sourcePO.getTableRows().get(1).getText()).toEqual(newTestSource.typeCode);
      expect(sourcePO.getTableRows().last().getText()).toEqual(newTestSource.status === 'A' ? 'Active' : 'Inactive');
    });
  });

  describe('Update Source Tests', () => {
    let moduleSource;
    beforeAll(done => {
      sourcePO.finJsonRequest('/api/module-source/query-one', 'GET', undefined, {moduleId: 1})
        .then(result => {
          moduleSource = result.body;
          done();
        });
    });

    it(`should show form with source values on clicking on the source name in table`, () => {
      sourcePO.loadFormInEditMode(existingSourceInDb.name);
      expect(sourcePO.getFormTitle().getText()).toEqual(`Edit Source`);
      expect(sourcePO.getFieldSourceName().getAttribute('value')).toEqual(existingSourceInDb.name);
      expect(sourcePO.getFieldTypeCode().getAttribute('value')).toEqual(existingSourceInDb.typeCode);
      expect(sourcePO.getFieldDescription().getAttribute('value')).toEqual(existingSourceInDb.desc);
      expect(sourcePO.isStatusCheckBoxChecked()).toBe(existingSourceInDb.status === 'A');
      expect(sourcePO.checkIfSourceIsUsed()).toEqual(sourcePO.isStatusCheckBoxDisabled());
    });

    it(`should show in use and disable checkbox for status, if a source is in use by a module`, () => {
      // we are only gonna check for first 3 sources that are in use, there could be 100 sources, no point in testing all of them
      let count = 0;
      existingSourcesInDb.forEach(source => {
        if (count < 3) {
          if (_.includes(moduleSource.sources, source.sourceId)) {
            count++;
            sourcePO.loadFormInEditMode(source.name);
            expect(sourcePO.checkIfSourceIsUsed()).toEqual(true);
            expect(sourcePO.isStatusCheckBoxDisabled()).toEqual(true);
            sourcePO.getSearchField().clear();
          }
        }
      });
    });

    it(`should not allow the user to submit the form when updating source with mandatory fields empty`, () => {
      sourcePO.loadFormInEditMode(newTestSource.name);
      sourcePO.getFieldSourceName().clear();
      sourcePO.getFieldTypeCode().clear();
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getFormInputOnlyFields().first().getAttribute(`class`)).toContain('ng-invalid');
      expect(sourcePO.getFormInputOnlyFields().get(1).getAttribute(`class`)).toContain('ng-invalid');
      sourcePO.pageRefresh();
      sourcePO.loadFormInEditMode(newTestSource.name);
      sourcePO.getFieldSourceName().clear();
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getFormInputOnlyFields().first().getAttribute(`class`)).toContain('ng-invalid');
      sourcePO.pageRefresh();
      sourcePO.loadFormInEditMode(newTestSource.name);
      sourcePO.getFieldTypeCode().clear();
      sourcePO.getSubmitButton().click();
      expect(sourcePO.getFormInputOnlyFields().get(1).getAttribute(`class`)).toContain('ng-invalid');
    });

    it(`should show an error dialog when updating source with mandatory fields that already exist`, () => {
      sourcePO.loadFormInEditMode(newTestSource.name);
      sourcePO.getFieldSourceName().clear();
      sourcePO.getFieldSourceName().sendKeys(existingSourceInDb.name);
      sourcePO.getSubmitButton().click();
      sourcePO.waitForDialogToShow();
      expect(sourcePO.getDialogTitle()).toEqual('Error');
      expect(sourcePO.getDialogMessage()).toContain('duplicate key error');
      sourcePO.pageRefresh();
      sourcePO.loadFormInEditMode(newTestSource.name);
      sourcePO.getFieldTypeCode().clear();
      sourcePO.getFieldTypeCode().sendKeys(existingSourceInDb.typeCode);
      sourcePO.getSubmitButton().click();
      sourcePO.waitForDialogToShow();
      expect(sourcePO.getDialogTitle()).toEqual('Error');
      expect(sourcePO.getDialogMessage()).toContain('duplicate key error');
    });

    it('should update the name of the test source', () => {
      sourcePO.loadFormInEditMode(newTestSource.name);
      sourcePO.getFieldSourceName().clear();
      newTestSource.name = 'Updated Test Source - E2ETEST';
      sourcePO.getFieldSourceName().sendKeys(newTestSource.name);
      sourcePO.getSubmitButton().click();
      sourcePO.waitForFormDown();
      sourcePO.getSearchField().clear();
      sourcePO.getSearchField().sendKeys(newTestSource.name);
      expect(sourcePO.getFirstCellInFirstRow().getText()).toEqual(newTestSource.name);
    });

    it('should update the type code of the test source', () => {
      sourcePO.loadFormInEditMode(newTestSource.name);
      sourcePO.getFieldTypeCode().clear();
      newTestSource.typeCode = 'UTEST';
      sourcePO.getFieldTypeCode().sendKeys(newTestSource.typeCode);
      sourcePO.getSubmitButton().click();
      sourcePO.waitForFormDown();
      sourcePO.getSearchField().clear();
      sourcePO.getSearchField().sendKeys(newTestSource.name);
      expect(sourcePO.getTableRows().get(1).getText()).toEqual(newTestSource.typeCode);
    });

    it(`should update an existing source to inactive`, () => {
      sourcePO.loadFormInEditMode(newTestSource.name);
      newTestSource.status = 'I';
      sourcePO.getStatusCheckBox().click();
      sourcePO.getSubmitButton().click();
      sourcePO.waitForFormDown();
      sourcePO.getSearchField().clear();
      sourcePO.getSearchField().sendKeys(newTestSource.name);
      expect(sourcePO.getTableRows().last().getText()).toEqual(newTestSource.status === 'A' ? 'Active' : 'Inactive');
    });
  });
});
