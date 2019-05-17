import { $, browser, by, element, protractor } from 'protractor';
const EC = protractor.ExpectedConditions;
export class SourcePO {
  form = $('edit-form-container');
  static navigateTo() {
    return browser.get('/admn/source');
  }

  static getSearchField() {
    return element.all(by.className(`mat-input-element`)).first();
  }
  static getAddButton() {
    return element(by.buttonText(`Add New`));
  }

  static getStatusCheckBox() {
    return element(by.name(`status`)).element(by.className(`checkbox__input`));
  }

  static getSubmitButton() {
    return element(by.buttonText(`Submit`));
  }

  static getPaginatorNextButton() {
    return element(by.className(`mat-paginator-navigation-next`));
  }

  static getCellRow() {
    return element.all(by.className(`mat-cell`));
  }

  static getFirstCellInARow() {
    return SourcePO.getCellRow().first().element(by.tagName(`a`));
  }

  static getFormField(selector) {
    return element(by.name(selector)).element(by.className(`form-group__text`)).element(by.className(`ng-star-inserted`));
  }

  static getFieldName() {
    return SourcePO.getFormField(`name`);
  }

  static getFieldTypeCode() {
    return SourcePO.getFormField(`typeCode`);
  }

  static getFieldDescription() {
    return SourcePO.getFormField(`desc`);
  }

  waitForFormUp() {
    browser.wait(EC.presenceOf(this.form));
  }

  waitForFormDown() {
    browser.wait(EC.stalenessOf(this.form));
  }


}
