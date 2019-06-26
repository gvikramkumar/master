import { browser, by, element } from 'protractor';
import {CommonPO} from '../common.po';
const pageUrl = '/admn/source';

export class SourcePO extends CommonPO {

  constructor() {
    super(pageUrl);
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

  getFormInputOnlyFields() {
     return element.all(by.tagName(`fin-input`));
  }


  isCheckBoxDisabled() {
    return element(by.className(`checkbox disabled`)).isPresent();
  }
}
