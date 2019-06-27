import {browser, by, element} from 'protractor';
import {CommonPO} from '../common.po';

const pageUrl = '/admn/module';
export class ModulePO extends CommonPO {

  constructor() {
    super(pageUrl);
  }

  init() {
    this.waitForTableToLoad();
  }

  getFieldModuleName() {
    return this.getFormInputField(`name`);
  }

  getFieldAbbreviation() {
    return this.getFormInputField(`abbrev`);
  }

  getFieldDisplayOrder() {
    return this.getFormInputField(`order`);
  }

  getFieldDescription() {
    return this.getFormTextareaField(`desc`);
  }


  getStatusCheckBox() {
    return this.getCheckBoxInputByName('status');
  }

  getStatusCheckBoxLabel() {
    return this.getCheckBoxLabelByName('status');
  }

  isStatusCheckBoxDisabled() {
    return this.isCheckBoxDisabled('status');
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
