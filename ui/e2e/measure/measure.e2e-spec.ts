import {MeasurePO} from './measure.po';
import * as moment from 'moment';

describe(`Profitabily Allocations - Measure page`, () => {
  const measurePO = new MeasurePO();
  let existingMeasuresInDb;
  beforeAll(done => {
    const url = '/api/measure';
    measurePO.finJsonRequest(url, 'GET', undefined, {moduleId: 1})
      .then((result: any) => {
        existingMeasuresInDb = JSON.parse(result.resp.body);
        done();
      });
  });
  beforeEach(() => {
    measurePO.navigateTo();
    measurePO.waitForTableToLoad();
  });

  it(`should load all the measures`, () => {
    expect(measurePO.getCountOfItemsLoadedInTheTable()).toEqual(existingMeasuresInDb.length);
  });

  it(`should find measure from search field`, () => {
    const existingMeasureInDb = existingMeasuresInDb[0];
    measurePO.getSearchField().sendKeys(existingMeasureInDb.name);
    expect(measurePO.getFirstCellInFirstRow().getText()).toEqual(existingMeasureInDb.name);
    expect(measurePO.getTableRows().get(1).getText()).toEqual(existingMeasureInDb.typeCode);
    expect(measurePO.getTableRows().get(2).getText()).toEqual('Active');
    expect(measurePO.getTableRows().get(3).getText()).toEqual(existingMeasureInDb.updatedBy);
    expect(measurePO.getTableRows().last().getText()).toEqual(moment(existingMeasureInDb.updatedDate).format('MM/DD/YYYY hh:mm A'));
  });
});
