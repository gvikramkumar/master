import {OpenPeriodPO} from './open-period.po';

describe(`Admin - Open period page`, () => {
  const openPeriodPO = new OpenPeriodPO();

  beforeAll(() => {
    openPeriodPO.navigateTo();
    openPeriodPO.waitForPageToLoad();
  });

  it(`should load all the active modules`, () => {
    expect(openPeriodPO.getActiveModules().count()).toBeGreaterThanOrEqual(11);
  });

  it('should be able to change open period for the test module', () => {
    openPeriodPO.getSelectForOpenPeriod(12).click();
    openPeriodPO.waitForSelectDropdownToShow();
    openPeriodPO.getDropdownOption(1).click();
  });


});
