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

  getFieldModuleName(finInput = false) {
    return this.getFormInputField(`name`, finInput);
  }

  getFieldAbbreviation(finInput = false) {
    return this.getFormInputField(`abbrev`, finInput);
  }

  getFieldDisplayOrder(finInput = false) {
    return this.getFormInputField(`order`, finInput);
  }

  getFieldDescription(finInput = false) {
    return this.getFormTextareaField(`desc`, finInput);
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

  getErrorMessageForModuleName() {
    return this.getErrorMessageForFormField('name');
  }

  getErrorMessageForAbbreviation() {
    return this.getErrorMessageForFormField('abbrev');
  }

  getErrorMessageForDisplayOrder() {
    return this.getErrorMessageForFormField('order');
  }
}
