import {OpenPeriodPO} from './open-period.po';

fdescribe(`Admin - Open period page`, () => {
  const openPeriodPO = new OpenPeriodPO();

  beforeAll(() => {
    openPeriodPO.navigateTo();
  });

  it(`should load all the active modules`, () => {
    expect(openPeriodPO.getActiveModules().count()).toBeGreaterThanOrEqual(11);
  });
});
