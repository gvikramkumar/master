import {browser, by, element, protractor} from 'protractor';

const EC = protractor.ExpectedConditions;

export class ModulePO {
  table = element(by.className(`mat-table`));
  form = element(by.className('edit-form-container'));

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

  getAddButton() {
    return element(by.buttonText(`Add New`));
  }

  waitForFormUp() {
    browser.wait(EC.presenceOf(this.form));
  }

  waitForFormDown() {
    browser.wait(EC.stalenessOf(this.form));
  }

  getFormTitle() {
    return element(by.tagName(`legend`));
  }

  getFieldModuleName() {
    return this.getFormField(`name`);
  }

  getFieldAbbreviation() {
    return this.getFormField(`abbrev`);
  }

  getFieldDisplayOrder() {
    return this.getFormField(`order`);
  }

  getFieldDescription() {
    return this.getFormField(`desc`);
  }

  getFormField(selector) {
    return element(by.name(selector)).element(by.className(`form-group__text`)).element(by.className(`ng-star-inserted`));
  }

  getStatusCheckBox() {
    return element(by.className(`checkbox`)).element(by.className(`checkbox__input`));
  }

  isCheckBoxDisabled() {
    return element(by.className(`checkbox disabled`)).isPresent();
  }

  getCheckBoxLabel() {
    return element(by.className(`checkbox`)).element(by.className(`checkbox__label`));
  }

  getSubmitButton() {
    return element(by.buttonText(`Submit`));
  }

  getCancelButton() {
    return element(by.buttonText(`Cancel`));
  }

  getFormInputOnlyFields() {
    return element.all(by.tagName(`fin-input`));
  }

  getErrorElementBlock(index) {
    return element.all(by.className(`help-block`)).get(index);
  }

  getErrorMessage(index) {
    return this.getErrorElementBlock(index).element(by.tagName(`span`)).getText();
  }

  loadFormInEditModeForModule(name) {
    this.getSearchField().sendKeys(name);
    this.getFirstCellInARow().click();
    this.waitForFormUp();
  }

  pageRefresh() {
    browser.refresh();
    this.waitForModulesToLoad();
  }
}
