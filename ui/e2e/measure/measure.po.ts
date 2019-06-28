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
    return this.getFormInputField('name', finInput);
  }

  getStatusCheckBox() {
    return this.getCheckBoxInputByName('status');
  }

  getStatusCheckBoxLabel() {
    return this.getCheckBoxLabelByName('status');
  }

  getFieldTypeCode(finInput = false) {
    return this.getFormInputField('typeCode', finInput);
  }

  getFieldSources(cuiMultiSelect = false) {
    return this.getFormInputField('sources', cuiMultiSelect);
  }

  getFieldHierarchies(cuiMultiSelect = false) {
    return this.getFormInputField('hier', cuiMultiSelect);
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

  openDropDownForSources() {
    this.openDropDownForSelectControl('soures');
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
