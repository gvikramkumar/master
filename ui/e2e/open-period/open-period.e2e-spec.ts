import {OpenPeriodPO} from './open-period.po';

xdescribe(`Admin - Open period page`, () => {
  const openPeriodPO = new OpenPeriodPO();
  const testModule = {
    displayOrder: 12,
    abbrev: 'test',
    name: 'Test Module for Open Period - E2ETEST',
    desc: 'Test Module added for open period testing',
    status: 'A',
  };
  beforeAll((done) => {
    // open-periods are tied to modules, so need to add a module to test its open-period
    openPeriodPO.finJsonRequest('/api/module', 'POST', testModule, undefined)
      .then(() => {
        done();
      });
  });

  afterAll(done => {
    openPeriodPO.finJsonRequest('/api/module/query-one', 'DELETE', undefined, {name: testModule.name})
      .then(result => {
        const deletedModule = result.body;
        openPeriodPO.finJsonRequest('/api/open-period/query-one', 'DELETE', undefined, {moduleId: deletedModule.moduleId})
          .then(() => done());
      });
  });

  beforeEach(() => {
    openPeriodPO.navigateTo();
  });

  it(`should load all the active modules`, () => {
    expect(openPeriodPO.getActiveModules().count()).toBeGreaterThanOrEqual(11);
  });

  it('should be able to change open period for the test module', () => {
    openPeriodPO.mouseDownOnElement(openPeriodPO.getSelectForOpenPeriod(11));
    openPeriodPO.getDropdownOption(0).click();
    openPeriodPO.getSubmitButton().click();
    openPeriodPO.mouseDownOnElement(openPeriodPO.getSelectForOpenPeriod(11));
    expect(openPeriodPO.getDropdownOption(0).getAttribute('className')).toContain('selected');
    openPeriodPO.pageRefresh();
    openPeriodPO.mouseDownOnElement(openPeriodPO.getSelectForOpenPeriod(11));
    openPeriodPO.getDropdownOption(1).click();
    openPeriodPO.getSubmitButton().click();
    openPeriodPO.mouseDownOnElement(openPeriodPO.getSelectForOpenPeriod(11));
    expect(openPeriodPO.getDropdownOption(1).getAttribute('className')).toContain('selected');
  });
});
