import {browser, by, element, protractor} from 'protractor';

const EC = protractor.ExpectedConditions;

export class ModulePO {
  table = element(by.className(`mat-table`));

  navigateTo() {
    return browser.get('/admn/module');
  }

  waitForModulesToLoad() {
    browser.wait(EC.presenceOf(this.table));
  }

  async getModulesLoaded() {
    const range = await element(by.className(`mat-paginator-range-label`)).getText();
    return Number(range.substr(range.indexOf('f') + 2));
  }

  getSearchField() {
    return element.all(by.className(`mat-input-element`)).first();
  }

  getFirstCellInARow() {
    return this.getCellRow().first().element(by.tagName(`a`));
  }

  getCellRow() {
    return element.all(by.className(`mat-cell`));
  }


}
