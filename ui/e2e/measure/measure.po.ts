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

  getFieldMeasureName(finInput = false) {
    return this.getFormInputFieldByName('name', finInput);
  }

  getStatusCheckBox() {
    return this.getCheckBoxInputByName('status');
  }

  getStatusCheckBoxLabel() {
    return this.getCheckBoxLabelByName('status');
  }

  isStatusCheckboxChecked() {
    return this.isCheckboxWithNameChecked('status');
  }

  getFieldTypeCode(finInput = false) {
    return this.getFormInputFieldByName('typeCode', finInput);
  }

  getFieldSources(cuiMultiSelect = false) {
    return this.getFormInputFieldByName('sources', cuiMultiSelect);
  }

  getFieldHierarchies(cuiMultiSelect = false) {
    return this.getFormInputFieldByName('hier', cuiMultiSelect);
  }

  getReportingLevel(level: number) {
    return this.getFormInputFieldByClassName(`rep-level-${level}`);
  }

  getReportingLevelCheckbox(level: number) {
    return this.getCheckBoxInputByClassName(`rep-level-checkbox-${level}`);
  }

  getReportingLevelCheckboxLabel(level: number) {
    return this.getCheckBoxLabelByClassName(`rep-level-checkbox-${level}`);
  }

  isReportingLevelCheckboxChecked(level: number) {
    return this.isCheckboxWithClassNameChecked(`rep-level-checkbox-${level}`);
  }

  getSetToSubMeasureNameCheckbox() {
    return this.getCheckBoxInputByClassName(`rep-level-sm-checkbox-3`);
  }

  getSetToSubMeasureNameCheckboxLabel() {
    return this.getCheckBoxLabelByClassName(`rep-level-sm-checkbox-3`);
  }

  isSetToSubMeasureNameCheckboxChecked() {
    return this.isCheckboxWithClassNameChecked('rep-level-sm-checkbox-3');
  }

  openDropDownForSources() {
    this.openDropDownForSelectControl('sources');
  }

  closeDropdownForSources() {
    this.closeDropdown('sources', {x: -50, y: 0});
  }

  clearDropdownForSources() {
    this.clearDropdown('sources');
  }

  openDropDownForHierarchies() {
    this.openDropDownForSelectControl('hier');
  }

  closeDropdownForHierarchies() {
    this.closeDropdown('hier', {x: -50, y: 0});
  }

  clearDropdownForHierarchies() {
    this.clearDropdown('hier');
  }

  getErrorMessageForMeasureName() {
    return this.getErrorMessageForFormField('name');
  }

  getErrorMessageForTypecode() {
    return this.getErrorMessageForFormField('typeCode');
  }
}
