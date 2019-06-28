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
    return element(by.className(`rep-level-${level}`)).element(by.className(`form-group__text`)).element(by.tagName('input'));
  }

  getReportingLevelCheckbox(level: number) {
    return element(by.className(`rep-level-checkbox-${level}`)).element(by.className(`checkbox`)).element(by.className(`checkbox__input`));
  }

  getReportingLevelCheckboxLabel(level: number) {
    return element(by.className(`rep-level-checkbox-${level}`)).element(by.className(`checkbox`)).element(by.className(`checkbox__label`)).getText();
  }

  getSetToSubMeasureNameCheckbox(level: number) {
    return element(by.className(`rep-level-sm-checkbox-${level}`)).element(by.className(`checkbox`)).element(by.className(`checkbox__input`));
  }

  getSetToSubMeasureNameCheckboxLabel(level: number) {
    return element(by.className(`rep-level-sm-checkbox-${level}`)).element(by.className(`checkbox`)).element(by.className(`checkbox__label`)).getText();
  }
 }
