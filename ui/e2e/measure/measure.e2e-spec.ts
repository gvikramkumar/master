import {MeasurePO} from './measure.po';
import * as moment from 'moment';

describe(`Profitabily Allocations - Measure page`, () => {
  const measurePO = new MeasurePO();
  let existingMeasuresInDb, existingMeasureInDb;
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
      expect(measurePO.getStatusCheckBoxLabel().getText()).toEqual(`Active`);
      expect(measurePO.getFieldTypeCode().getAttribute('value')).toEqual(``);
      expect(measurePO.getFieldSources().getAttribute('value')).toEqual(``);
      expect(measurePO.getFieldHierarchies().getAttribute('value')).toEqual(``);
      expect(measurePO.getReportingLevel(1).getAttribute('value')).toEqual(``);
      expect(measurePO.getReportingLevel(2).getAttribute('value')).toEqual(``);
      expect(measurePO.getReportingLevel(3).getAttribute('value')).toEqual(``);
      expect(measurePO.getReportingLevelCheckbox(1).isEnabled()).toBe(true);
      expect(measurePO.getReportingLevelCheckbox(2).isEnabled()).toBe(true);
      expect(measurePO.getReportingLevelCheckbox(3).isEnabled()).toBe(true);

      expect(measurePO.getSubmitButton().isPresent()).toBe(true);
      expect(measurePO.getCancelButton().isPresent()).toBe(true);
      expect(measurePO.getResetButton().isPresent()).toBe(true);
    });
  });
});
