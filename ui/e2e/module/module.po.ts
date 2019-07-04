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
    return this.getFormInputFieldByName(`name`, finInput);
  }

  getFieldAbbreviation(finInput = false) {
    return this.getFormInputFieldByName(`abbrev`, finInput);
  }

  getFieldDisplayOrder(finInput = false) {
    return this.getFormInputFieldByName(`order`, finInput);
  }

  getFieldDescription(finInput = false) {
    return this.getFormTextareaFieldByName(`desc`, finInput);
  }


  getStatusCheckBox() {
    return this.getCheckBoxInputByName('status');
  }

  getStatusCheckBoxLabel() {
    return this.getCheckBoxLabelByName('status');
  }

  isStatusCheckBoxDisabled() {
    return this.isCheckBoxWithNameDisabled('status');
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
