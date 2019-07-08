import {browser, by, element} from 'protractor';
import {CommonPO} from '../common.po';

const pageUrl = '/admn/open-period';

export class OpenPeriodPO extends CommonPO {

  constructor() {
    super(pageUrl);
  }

  init() {
    this.waitForPageToLoad();
  }

  getActiveModules() {
    return element.all(by.className('module-name'));
  }

  getSelectForOpenPeriod(index) {
    return element.all(by.className('dropdown-chevron icon-chevron-down')).get(index);
  }
}
