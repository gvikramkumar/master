import {browser, by, element, protractor} from 'protractor';
import {CommonPO} from '../common.po';

export class SourceMappingPO extends CommonPO {

  navigateTo() {
    return super.navigateTo('/admn/source-mapping');
  }

  getActiveModules() {
    return element.all(by.className('module-name'));
  }

  getSelectOption() {
    return element(by.className('cui-virtual-scroll-content-wrapper')).element(by.tagName('div')).element(by.tagName('a')).element(by.tagName('label'));
  }

  getSelectCheckbox() {
    return this.getSelectOption().element(by.className('checkbox__input'));
  }

  getSelectInputForModule(index) {
    return element.all(by.className('form-group__text')).get(index).element(by.tagName('input'));
  }

  checkIfCheckboxIsChecked() {
    return this.getSelectOption().element(by.tagName('input')).getAttribute('checked');
  }

  waitForDropdownToShow() {
    browser.wait(this.EC.presenceOf(element(by.className('dropdown active'))));
  }
}
