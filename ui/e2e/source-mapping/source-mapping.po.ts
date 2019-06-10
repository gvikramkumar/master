import {browser, by, element, protractor} from 'protractor';
import {CommonPO} from '../common.po';

export class SourceMappingPO extends CommonPO {

  navigateTo() {
    return super.navigateTo('/admn/source-mapping');
  }

  getActiveModules() {
    return element.all(by.className('module-name'));
  }

  getSelectCheckbox() {
    return element(by.tagName('a')).element(by.className('checkbox')).element(by.className('checkbox__input'));
  }

  getSelectForModule(index) {
    // return element.all(by.className('dropdown-chevron icon-chevron-down')).get(index);
    return element.all(by.className('form-group__text')).get(index).element(by.tagName('input'));
  }
}
