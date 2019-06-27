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

  getFieldName() {
    return this.getFormInputField(`name`);
  }

  getFieldTypeCode() {
    return this.getFormInputField(`typeCode`);
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

  checkIfSourceIsUsed() {
    return element(by.className(`in-use`)).isDisplayed();
  }

  getFormInputOnlyFields() {
    return element.all(by.tagName(`fin-input`));
  }
}
