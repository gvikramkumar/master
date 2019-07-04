import {browser, by, element} from 'protractor';
import {CommonPO} from '../common.po';

const pageUrl = '/admn/source';

export class SourcePO extends CommonPO {

  constructor() {
    super(pageUrl);
  }

  init() {
    this.waitForTableToLoad();
  }

  getFieldSourceName() {
    return this.getFormInputFieldByName(`name`);
  }

  getFieldTypeCode() {
    return this.getFormInputFieldByName(`typeCode`);
  }

  getFieldDescription() {
    return this.getFormTextareaFieldByName(`desc`);
  }

  getStatusCheckBox() {
    return this.getCheckBoxInputByName('status');
  }

  getStatusCheckBoxLabel() {
    return this.getCheckBoxLabelByName('status');
  }

  isStatusCheckBoxChecked() {
    return this.isCheckBoxWithNameChecked('status');
  }

  isStatusCheckBoxDisabled() {
    return this.isCheckBoxWithNameDisabled('status');
  }

  checkIfSourceIsUsed() {
    return element(by.className(`in-use`)).isDisplayed();
  }

  getFormInputOnlyFields() {
    return element.all(by.tagName(`fin-input`));
  }
}
