import {MeasurePO} from './measure.po';
import * as moment from 'moment';
import * as _ from 'lodash';

describe(`Profitabily Allocations - Measure page`, () => {
  const url = '/api/measure';
  const measurePO = new MeasurePO();
  let existingMeasuresInDb, existingMeasureInDb;

  let newTestMeasure: any = {
    name: 'Test Measure - E2ETEST',
    typeCode: 'test',
    reportingLevels: [
      'Indirect',
      'Excess and obsolete'
    ],
    updatedBy: 'jodoe'
  };

  beforeAll(done => {
    measurePO.finJsonRequest(url, 'GET', undefined, {moduleId: 1})
      .then(result => {
        existingMeasuresInDb = result.body;
        existingMeasureInDb = existingMeasuresInDb[0];
        done();
      });
  });

  afterAll(done => {
    measurePO.finJsonRequest(`${url}/${newTestMeasure.id}`, 'DELETE', undefined, undefined)
      .then(() => done());
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
    expect(measurePO.getTableRows().get(2).getText()).toEqual(existingMeasureInDb.status === 'A' ? 'Active' : 'Inactive');
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
      expect(measurePO.getReportingLevelCheckBox(1).isEnabled()).toBe(true);
      expect(measurePO.getReportingLevelCheckBox(2).isEnabled()).toBe(true);
      expect(measurePO.getReportingLevelCheckBox(3).isEnabled()).toBe(true);
      expect(measurePO.getReportingLevelCheckBoxLabel(1)).toEqual(`Enabled`);
      expect(measurePO.getReportingLevelCheckBoxLabel(2)).toEqual(`Enabled`);
      expect(measurePO.getReportingLevelCheckBoxLabel(3)).toEqual(`Enabled`);
      expect(measurePO.getSetToSubMeasureNameCheckBox().isEnabled()).toBe(true);
      expect(measurePO.getSetToSubMeasureNameCheckBoxLabel()).toEqual(`Set To Submeasure Name`);
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
      expect(measurePO.getErrorMessageForTypecode()).toEqual('Type Code already exists');
    });

    it(`should reset form on clicking reset button`, () => {
      measurePO.getAddButton().click();
      measurePO.waitForFormUp();
      measurePO.getFieldMeasureName().sendKeys(newTestMeasure.name);
      measurePO.getFieldTypeCode().sendKeys(newTestMeasure.typeCode);
      measurePO.getStatusCheckBox().click();
      measurePO.openDropDownForSources();
      measurePO.getDropdownOption(0).click();
      measurePO.closeDropdownForSources();
      measurePO.openDropDownForHierarchies();
      measurePO.getDropdownOption(0).click();
      measurePO.getDropdownOption(1).click();
      measurePO.closeDropdownForHierarchies();
      measurePO.getReportingLevel(1).sendKeys(newTestMeasure.reportingLevels[0]);
      measurePO.getReportingLevel(2).sendKeys(newTestMeasure.reportingLevels[1]);
      measurePO.getReportingLevelCheckBox(2).click();
      measurePO.getSetToSubMeasureNameCheckBox().click();
      measurePO.getResetButton().click();
      measurePO.waitForDialogToShow();
      expect(measurePO.getDialogMessage()).toEqual('Are you sure you want to lose your changes?');
      measurePO.getYesButton().click();
      measurePO.waitForDialogToHide();
      expect(measurePO.getFieldMeasureName().getAttribute('value')).toEqual(``);
      expect(measurePO.isStatusCheckBoxChecked()).toBe(false);
      expect(measurePO.getFieldTypeCode().getAttribute('value')).toEqual(``);
      expect(measurePO.getFieldSources().getAttribute('value')).toEqual(``);
      expect(measurePO.getFieldHierarchies().getAttribute('value')).toEqual(``);
      expect(measurePO.getReportingLevel(1).getAttribute('value')).toEqual(``);
      expect(measurePO.getReportingLevel(2).getAttribute('value')).toEqual(``);
      expect(measurePO.isReportingLevelCheckBoxChecked(2)).toBe(false);
      expect(measurePO.getReportingLevel(3).getAttribute('value')).toEqual(``);
      expect(measurePO.isSetToSubMeasureNameCheckBoxChecked()).toBe(false);
    });

    it(`should disable reporting level 3 on checking setToSubmeasure flag`, () => {
      measurePO.getAddButton().click();
      measurePO.waitForFormUp();
      measurePO.getSetToSubMeasureNameCheckBox().click();
      expect(measurePO.getReportingLevel(3).isEnabled()).toEqual(false);
      expect(measurePO.isReportingLevelCheckBoxDisabled(3)).toEqual(true);
    });

    it(`should add a new measure with active status`, async () => {
      measurePO.getAddButton().click();
      measurePO.waitForFormUp();
      measurePO.getFieldMeasureName().sendKeys(newTestMeasure.name);
      measurePO.getFieldTypeCode().sendKeys(newTestMeasure.typeCode);
      measurePO.getStatusCheckBox().click();
      measurePO.openDropDownForSources();
      measurePO.getDropdownOption(0).click();
      measurePO.closeDropdownForSources();
      measurePO.openDropDownForHierarchies();
      measurePO.getDropdownOption(0).click();
      measurePO.getDropdownOption(1).click();
      measurePO.closeDropdownForHierarchies();
      measurePO.getReportingLevel(1).sendKeys(newTestMeasure.reportingLevels[0]);
      measurePO.getReportingLevel(2).sendKeys(newTestMeasure.reportingLevels[1]);
      measurePO.getReportingLevelCheckBox(2).click();
      measurePO.getSetToSubMeasureNameCheckBox().click();
      measurePO.getSubmitButton().click();
      measurePO.waitForDialogToShow();
      expect(measurePO.getDialogMessage()).toEqual(`Are you sure you want to save?`);
      measurePO.getYesButton().click();
      measurePO.waitForDialogToHide();
      measurePO.init();
      measurePO.getSearchField().sendKeys(newTestMeasure.name);
      expect(measurePO.getFirstCellInFirstRow().getText()).toEqual(newTestMeasure.name);
      expect(measurePO.getTableRows().get(1).getText()).toEqual(newTestMeasure.typeCode);
      expect(measurePO.getTableRows().get(2).getText()).toEqual('Active');
      expect(measurePO.getTableRows().get(3).getText()).toEqual(newTestMeasure.updatedBy);
      expect(moment(await measurePO.getTableRows().last().getText(), 'MM/DD/YYYY hh:mm A').minutes()).toBeLessThanOrEqual(moment().minutes());
    });
  });

  describe(`Update Measure Test`, () => {
    let sources;
    beforeAll(done => {
      Promise.all([
        measurePO.finJsonRequest(url, 'GET', undefined, {moduleId: 1}),
        measurePO.finJsonRequest('/api/source', 'GET', undefined, undefined)
      ])
        .then(results => {
          existingMeasuresInDb = results[0].resp.body;
          sources = results[1].resp.body;
          newTestMeasure = existingMeasuresInDb.filter(measure => measure.name === newTestMeasure.name)[0];
          done();
        });
    });

    it(`should show form with measure values on clicking on the measure name in table`, () => {
      measurePO.loadFormInEditMode(newTestMeasure.name);
      expect(measurePO.getFieldMeasureName().getAttribute('value')).toEqual(newTestMeasure.name);
      expect(measurePO.getFieldTypeCode().getAttribute('value')).toEqual(newTestMeasure.typeCode);
      expect(measurePO.isStatusCheckBoxChecked()).toEqual(true);
      const sourceName = sources.filter(source => source.sourceId === newTestMeasure.sources[0])[0].name;
      expect(measurePO.getFieldSources().getAttribute('value')).toEqual(sourceName);
      expect(measurePO.getFieldHierarchies().getAttribute('value')).toEqual(newTestMeasure.hierarchies.map(x => _.upperFirst(x.toLowerCase())).join(', '));
      expect(measurePO.getReportingLevel(1).getAttribute('value')).toEqual(newTestMeasure.reportingLevels[0]);
      expect(measurePO.isReportingLevelCheckBoxChecked(1)).toEqual(newTestMeasure.reportingLevelEnableds[0]);
      expect(measurePO.getReportingLevel(2).getAttribute('value')).toEqual(newTestMeasure.reportingLevels[1]);
      expect(measurePO.isReportingLevelCheckBoxChecked(2)).toEqual(newTestMeasure.reportingLevelEnableds[1]);
      expect(measurePO.getReportingLevel(3).getAttribute('value')).toEqual(newTestMeasure.reportingLevels[2]);
      expect(measurePO.isReportingLevelCheckBoxChecked(3)).toEqual(newTestMeasure.reportingLevelEnableds[2]);
      expect(measurePO.isSetToSubMeasureNameCheckBoxChecked()).toEqual(newTestMeasure.reportingLevel3SetToSubmeasureName);
    });

    it(`should not allow the user to submit the form when updating measure with mandatory fields empty`, () => {
      measurePO.loadFormInEditMode(newTestMeasure.name);
      measurePO.getFieldMeasureName().clear();
      measurePO.getFieldTypeCode().clear();
      measurePO.clearDropdownForSources();
      measurePO.clearDropdownForHierarchies();
      expect(measurePO.getFieldMeasureName(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldTypeCode(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldSources(true).getAttribute(`class`)).toContain('ng-invalid');
      expect(measurePO.getFieldHierarchies(true).getAttribute(`class`)).toContain('ng-invalid');
    });

    it(`should show an error message when updating measure with mandatory fields that already exist`, () => {
      measurePO.loadFormInEditMode(newTestMeasure.name);
      measurePO.getFieldMeasureName().clear();
      measurePO.getFieldMeasureName().sendKeys(existingMeasureInDb.name);
      expect(measurePO.getErrorMessageForMeasureName()).toEqual('Measure name already exists');
      measurePO.getFieldTypeCode().clear();
      measurePO.getFieldTypeCode().sendKeys(existingMeasureInDb.typeCode);
      expect(measurePO.getErrorMessageForTypecode()).toEqual('Type Code already exists');
    });

    it(`should update the name of a measure`, () => {
      measurePO.loadFormInEditMode(newTestMeasure.name);
      measurePO.getFieldMeasureName().clear();
      newTestMeasure.name = 'Updated Test Measure - E2ETEST';
      measurePO.getFieldMeasureName().sendKeys(newTestMeasure.name);
      measurePO.confirmAndSubmit();
      measurePO.getSearchField().sendKeys(newTestMeasure.name);
      expect(measurePO.getFirstCellInFirstRow().getText()).toEqual(newTestMeasure.name);
    });

    it(`should update the type code of a measure`, () => {
      measurePO.loadFormInEditMode(newTestMeasure.name);
      measurePO.getFieldTypeCode().clear();
      newTestMeasure.typeCode = 'utest';
      measurePO.getFieldTypeCode().sendKeys(newTestMeasure.typeCode);
      measurePO.confirmAndSubmit();
      measurePO.getSearchField().sendKeys(newTestMeasure.name);
      expect(measurePO.getTableRows().get(1).getText()).toEqual(newTestMeasure.typeCode);
    });

    it(`should update a test measure to inactive`, () => {
      measurePO.loadFormInEditMode(newTestMeasure.name);
      measurePO.getStatusCheckBox().click();
      measurePO.confirmAndSubmit();
      measurePO.getSearchField().sendKeys(newTestMeasure.name);
      expect(measurePO.getTableRows().get(2).getText()).toEqual('Inactive');
    });

    it(`should update sources of a measure`, async () => {
      measurePO.loadFormInEditMode(newTestMeasure.name);
      measurePO.clearDropdownForSources();
      measurePO.openDropDownForSources();
      measurePO.getDropdownOption(0).click();
      measurePO.getDropdownOption(1).click();
      measurePO.closeDropdownForSources();
      measurePO.confirmAndSubmit();
      measurePO.loadFormInEditMode(newTestMeasure.name);
      const measureSources = await measurePO.getFieldSources().getAttribute('value');
      measureSources.split(',').map(x => x.trim()).forEach(x => expect(sources.filter(source => source.name === x).length).toEqual(1));
    });

    it(`should update hierarchies of a measure`, async () => {
      measurePO.loadFormInEditMode(newTestMeasure.name);
      measurePO.clearDropdownForHierarchies();
      measurePO.openDropDownForHierarchies();
      measurePO.getDropdownOption(0).click();
      measurePO.closeDropdownForHierarchies();
      measurePO.confirmAndSubmit();
      measurePO.loadFormInEditMode(newTestMeasure.name);
      expect(measurePO.getFieldHierarchies().getAttribute('value')).toEqual(_.upperFirst(newTestMeasure.hierarchies[0].toLowerCase()));
    });

    it('should enable reporting level 3 and enable the enabled checkbox on unchecking setToSubmeasureName checkbox', () => {
      measurePO.loadFormInEditMode(newTestMeasure.name);
      measurePO.getSetToSubMeasureNameCheckBox().click();
      expect(measurePO.getReportingLevel(3).isEnabled()).toEqual(true);
      expect(measurePO.isReportingLevelCheckBoxDisabled(3)).toEqual(false);
      measurePO.getReportingLevel(3).sendKeys(newTestMeasure.reportingLevels[0]);
      measurePO.getReportingLevelCheckBox(3).click();
      measurePO.confirmAndSubmit();
      measurePO.loadFormInEditMode(newTestMeasure.name);
      expect(measurePO.getReportingLevel(3).getAttribute('value')).toEqual(newTestMeasure.reportingLevels[0]);
      expect(measurePO.isReportingLevelCheckBoxChecked(3)).toEqual(true);
    });
  });
});
