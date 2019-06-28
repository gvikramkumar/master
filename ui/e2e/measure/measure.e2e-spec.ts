import {MeasurePO} from './measure.po';
import * as moment from 'moment';

describe(`Profitabily Allocations - Measure page`, () => {
  const measurePO = new MeasurePO();
  let existingMeasuresInDb, existingMeasureInDb;

  const newTestMeasure = {
    name: 'Test Measure - E2ETEST',
    typeCode: 'test'
  };

  beforeAll(done => {
    const url = '/api/measure';
    measurePO.finJsonRequest(url, 'GET', undefined, {moduleId: 1})
      .then(result => {
        existingMeasuresInDb = result.body;
        existingMeasureInDb = existingMeasuresInDb[0];
        done();
      });
  });
  beforeEach(() => {
    measurePO.navigateTo();
  });

  it(`should load all the measures`, () => {
    expect(measurePO.getCountOfItemsLoadedInTheTable()).toEqual(existingMeasuresInDb.length);
  });

  it(`should find measure from search field`, () => {
    measurePO.getSearchField().sendKeys(existingMeasureInDb.name);
    expect(measurePO.getFirstCellInFirstRow().getText()).toEqual(existingMeasureInDb.name);
    expect(measurePO.getTableRows().get(1).getText()).toEqual(existingMeasureInDb.typeCode);
    expect(measurePO.getTableRows().get(2).getText()).toEqual('Active');
    expect(measurePO.getTableRows().get(3).getText()).toEqual(existingMeasureInDb.updatedBy);
    expect(measurePO.getTableRows().last().getText()).toEqual(moment(existingMeasureInDb.updatedDate).format('MM/DD/YYYY hh:mm A'));
  });
  
  describe(`Add Measure tests`, () => {
    it(`should show form on clicking add`, () => {
      measurePO.getAddButton().click();
      measurePO.waitForFormUp();
      expect(measurePO.form.isPresent()).toBe(true);
      expect(measurePO.getFieldMeasureName().getAttribute('value')).toEqual(``);
      expect(measurePO.getStatusCheckBox().isEnabled()).toBe(true);
      expect(measurePO.getStatusCheckBoxLabel()).toEqual(`Active`);
      expect(measurePO.getFieldTypeCode().getAttribute('value')).toEqual(``);
      expect(measurePO.getFieldSources().getAttribute('value')).toEqual(``);
      expect(measurePO.getFieldHierarchies().getAttribute('value')).toEqual(``);
      expect(measurePO.getReportingLevel(1).getAttribute('value')).toEqual(``);
      expect(measurePO.getReportingLevel(2).getAttribute('value')).toEqual(``);
      expect(measurePO.getReportingLevel(3).getAttribute('value')).toEqual(``);
      expect(measurePO.getReportingLevelCheckbox(1).isEnabled()).toBe(true);
      expect(measurePO.getReportingLevelCheckbox(2).isEnabled()).toBe(true);
      expect(measurePO.getReportingLevelCheckbox(3).isEnabled()).toBe(true);
      expect(measurePO.getReportingLevelCheckboxLabel(1)).toEqual(`Enabled`);
      expect(measurePO.getReportingLevelCheckboxLabel(2)).toEqual(`Enabled`);
      expect(measurePO.getReportingLevelCheckboxLabel(3)).toEqual(`Enabled`);
      expect(measurePO.getSetToSubMeasureNameCheckbox(3).isEnabled()).toBe(true);
      expect(measurePO.getSetToSubMeasureNameCheckboxLabel(3)).toEqual(`Set To Submeasure Name`);
      expect(measurePO.getSubmitButton().isPresent()).toBe(true);
      expect(measurePO.getCancelButton().isPresent()).toBe(true);
      expect(measurePO.getResetButton().isPresent()).toBe(true);
    });

    it(`should close form on clicking cancel`, () => {
      measurePO.getAddButton().click();
      measurePO.waitForFormUp();
      measurePO.getCancelButton().click();
      measurePO.waitForFormDown();
      expect(measurePO.form.isPresent()).toBe(false);
    });


    it(`should not allow the user to submit form with missing mandatory values`, () => {
      measurePO.getAddButton().click();
      measurePO.waitForFormUp();
      measurePO.getSubmitButton().click();
      expect(measurePO.getFieldMeasureName(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldTypeCode(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldSources(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldHierarchies(true).getAttribute(`class`)).toContain('ng-invalid');
      measurePO.getFieldMeasureName().sendKeys(newTestMeasure.name);
      measurePO.getSubmitButton().click();
      expect(measurePO.getFieldTypeCode(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldSources(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldHierarchies(true).getAttribute(`class`)).toContain('ng-invalid');
      measurePO.getFieldMeasureName().clear();
      measurePO.getFieldTypeCode().sendKeys(newTestMeasure.typeCode);
      measurePO.getSubmitButton().click();
      expect(measurePO.getFieldMeasureName(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldSources(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldHierarchies(true).getAttribute(`class`)).toContain('ng-invalid');
      measurePO.getFieldTypeCode().clear();
      measurePO.openDropDownForSources();
      measurePO.getDropdownOption(0).click();
      measurePO.closeDropdownForSources();
      measurePO.getSubmitButton().click();
      expect(measurePO.getFieldMeasureName(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldTypeCode(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldHierarchies(true).getAttribute(`class`)).toContain('ng-invalid');
      measurePO.clearDropdownForSources();
      measurePO.openDropDownForHierarchies();
      measurePO.getDropdownOption(0).click();
      measurePO.closeDropdownForHierarchies();
      measurePO.getSubmitButton().click();
      expect(measurePO.getFieldMeasureName(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldTypeCode(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldSources(true).getAttribute(`class`)).toContain('ng-invalid');
      measurePO.clearDropdownForHierarchies();
    });

    it(`should show an error on the form field when the user adds a mandatory form field that already exists`, () => {
      measurePO.getAddButton().click();
      measurePO.waitForFormUp();
      measurePO.getFieldMeasureName().sendKeys(existingMeasureInDb.name);
      expect(measurePO.getErrorMessageForMeasureName()).toEqual('Measure name already exists');
      measurePO.getFieldTypeCode().sendKeys(existingMeasureInDb.typeCode);
      expect(measurePO.getErrorMessageForTypecode()).toEqual('Typecode already exists');
    });
  });
});
