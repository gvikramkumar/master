import {browser, by, element} from 'protractor';
import {CommonPO} from '../common.po';

const pageUrl = '/admn/module';
export class ModulePO extends CommonPO {

  constructor() {
    super(pageUrl);
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

  getStatusCheckBox() {
    return element(by.className(`checkbox`)).element(by.className(`checkbox__input`));
  }

  isCheckBoxDisabled() {
    return element(by.className(`checkbox disabled`)).isPresent();
  }

  getCheckBoxLabel() {
    return element(by.className(`checkbox`)).element(by.className(`checkbox__label`));
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

}
