import {OpenPeriodPO} from './open-period.po';

describe(`Admin - Open period page`, () => {
  const openPeriodPO = new OpenPeriodPO();
  const testModule = {
    displayOrder : 12,
    abbrev : 'test',
    name : 'Test Module for Open Period - E2ETEST',
    desc : 'Test Module added for open period testing',
    status : 'A',
  };
  beforeAll((done) => {
    // open-periods are tied to modules, so need to add a module to test its open-period
    openPeriodPO.finJsonRequest('/api/module', 'POST', testModule)
      .then(() => {
        openPeriodPO.navigateTo();
        openPeriodPO.waitForPageToLoad();
        done();
      });
  });

  afterAll(done => {
    openPeriodPO.finJsonRequest('/api/module/query-one', 'DELETE', undefined, {qs: {name: testModule.name}})
      .then(() => done());
  });

  it(`should load all the active modules`, () => {
    expect(openPeriodPO.getActiveModules().count()).toBeGreaterThanOrEqual(11);
  });

  it('should be able to change open period for the test module', () => {
    openPeriodPO.mouseDownOnElement(openPeriodPO.getSelectForOpenPeriod(11));
    expect(openPeriodPO.getDropdownOption(0).getAttribute('className')).toEqual('selected');
    openPeriodPO.getDropdownOption(1).click();
    openPeriodPO.getSubmitButton().click();
    openPeriodPO.mouseDownOnElement(openPeriodPO.getSelectForOpenPeriod(11));
    expect(openPeriodPO.getDropdownOption(1).getAttribute('className')).toContain('selected');
  });
});
