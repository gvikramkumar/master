import {CommonPO} from '../common.po';
import {browser, by, element, protractor} from 'protractor';

const pageUrl = '/prof/admin/measure';

export class MeasurePO extends CommonPO {
  form = element(by.tagName('form'));

  constructor() {
    super(pageUrl);
  }

  init() {
    this.waitForTableToLoad();
  }

  getFieldMeasureName() {
    return this.getFormInputField('name');
  }

  getStatusCheckBox() {
    return this.getCheckBoxInputByName('status');
  }

  getStatusCheckBoxLabel() {
    return this.getCheckBoxLabelByName('status');
  }

  getFieldTypeCode() {
    return this.getFormInputField('typeCode');
  }

  getFieldSources() {
    return this.getFormInputField('sources');
  }

  getFieldHierarchies() {
    return this.getFormInputField('hier');
  }

  getReportingLevel(level: number) {
    return element.all(by.className(`rep-level-${level}`)).get(level - 1).element(by.className(`form-group__text`)).element(by.tagName('input'));
  }

  getReportingLevelCheckbox(level: number) {
    return element.all(by.className(`rep-level-checkbox-${level}`)).get(level - 1).element(by.className(`checkbox`)).element(by.className(`checkbox__input`));
  }

  getReportingLevelCheckboxLabel(level: number) {
    return element.all(by.className(`rep-level-checkbox-${level}`)).get(level - 1).element(by.className(`checkbox`)).element(by.className(`checkbox__label`));
  }
 }
