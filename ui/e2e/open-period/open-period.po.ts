import {browser, by, element} from 'protractor';

export class OpenPeriodPO {
  navigateTo() {
    return browser.get('/admn/open-period');
  }

  getActiveModules() {
    return element.all(by.className('module-name'));
  }
}
