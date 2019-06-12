import { browser, by, element } from 'protractor';
import {CommonPO} from '../common.po';

export class SourcePO extends CommonPO {
  form = element(by.className('edit-form-container'));
  table = element(by.className(`mat-table`));
  dialog = element(by.className(`mat-dialog-container`));

  navigateTo() {
    return super.navigateTo('/admn/source');
  }

   async getSourcesLoaded() {
    const range = await element(by.className(`mat-paginator-range-label`)).getText();
    return Number(range.substr(range.indexOf('f') + 2));
  }

   getSearchField() {
    return element.all(by.className(`mat-input-element`)).first();
  }
   getAddButton() {
    return element(by.buttonText(`Add New`));
  }

   getStatusCheckBox() {
    return element(by.name(`status`)).element(by.className(`checkbox__input`));
  }

   getCheckBoxLabel() {
    return element(by.name(`status`)).element(by.className(`checkbox__label`));
  }

   getCellRow() {
    return element.all(by.className(`mat-cell`));
  }

   getFirstCellInARow() {
    return this.getCellRow().first().element(by.tagName(`a`));
  }

   getFormField(selector) {
    return element(by.name(selector)).element(by.className(`form-group__text`)).element(by.className(`ng-star-inserted`));
  }

   getFieldName() {
    return this.getFormField(`name`);
  }

   getFieldTypeCode() {
    return this.getFormField(`typeCode`);
  }

   getFieldDescription() {
    return this.getFormField(`desc`);
  }

   checkIfSourceIsUsed() {
    return element(by.className(`in-use`)).isDisplayed();
  }

   getFormTitle() {
    return element(by.tagName(`legend`));
  }

  getFormInputOnlyFields() {
     return element.all(by.tagName(`fin-input`));
  }

  waitForSourcesToLoad() {
    browser.wait(this.EC.presenceOf(this.table));
  }

  waitForFormUp() {
    browser.wait(this.EC.presenceOf(this.form));
  }

  waitForFormDown() {
    browser.wait(this.EC.stalenessOf(this.form));
  }

  loadFormInEditModeForSource(name) {
    this.getSearchField().sendKeys(name);
    this.getFirstCellInARow().click();
    this.waitForFormUp();
  }

  isCheckBoxDisabled() {
    return element(by.className(`checkbox disabled`)).isPresent();
  }

  waitForDialogToShow() {
     browser.wait(this.EC.presenceOf(this.dialog));
  }

  getDialogTitle() {
     return element(by.className(`mat-dialog-title`));
  }

  getDialogMessage() {
     return element(by.className(`fin-dialog-title`));
  }

  closeDialog() {
     element(by.buttonText('OK')).click();
     browser.wait(this.EC.stalenessOf(this.dialog));
  }

  pageRefresh() {
     browser.refresh();
     this.waitForSourcesToLoad();
  }
}
