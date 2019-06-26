import {browser, by, element} from 'protractor';
import {CommonPO} from '../common.po';

const pageUrl = '/admn/open-period';

export class OpenPeriodPO extends CommonPO {

  constructor() {
    super(pageUrl);
  }

  getActiveModules() {
    return element.all(by.className('module-name'));
  }

  getSelectForOpenPeriod(index) {
    return element.all(by.className('dropdown-chevron icon-chevron-down')).get(index);
  }

  mouseDownOnElement(_element) {
    browser.actions().mouseDown(_element).perform();
  }

  getDropdownOption(index) {
    return element(by.className('cui-virtual-scroll-content-wrapper')).all(by.tagName('div')).get(index).element(by.tagName(`a`));
  }

  pageRefresh() {
    browser.refresh();
    this.waitForPageToLoad();
  }
}
