import {ModulePO} from './module.po';

fdescribe(`Admin - Module Page`, () => {
  const modulePO = new ModulePO();

  const existingModuleInDb = {
    displayOrder : '1',
    abbrev : 'prof',
    name : 'Profitability Allocations',
    desc : `This capability performs allocations at the multiple dimensions/hierarchies such as Sales Theater Level 
            and Product Family Level used for Company's Profit/Loss (P/L) reporting to drive profitable growth.`,
    status : 'Active'
  };

  beforeEach(() => {
    modulePO.navigateTo();
    modulePO.waitForModulesToLoad();
  });

  it(`should load all the modules`, () => {
    expect(modulePO.getModulesLoaded()).toBeGreaterThanOrEqual(11);
  });

  it(`should find module from search field`, () => {
    modulePO.getSearchField().sendKeys(existingModuleInDb.name);
    expect(modulePO.getFirstCellInARow().getText()).toEqual(existingModuleInDb.name);
    expect(modulePO.getCellRow().get(1).getText()).toEqual(existingModuleInDb.abbrev);
    expect(modulePO.getCellRow().get(2).getText()).toEqual(existingModuleInDb.displayOrder);
    expect(modulePO.getCellRow().last().getText()).toEqual(existingModuleInDb.status);
  });
});
