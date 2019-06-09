import {browser, by, element, protractor} from 'protractor';
const EC = protractor.ExpectedConditions;
export class OpenPeriodPO {
  container = element(by.className(`fin-container`));
  navigateTo() {
    return browser.get('/admn/open-period');
  }

  waitForPageToLoad() {
    browser.wait(EC.presenceOf(this.container));
  }

  getActiveModules() {
    return element.all(by.className('module-name'));
  }

  getSelectForOpenPeriod(index) {
    return element.all(by.className('dropdown-chevron icon-chevron-down')).get(index);
  }

  waitForSelectDropdownToShow() {
    browser.wait(EC.presenceOf(element(by.className('dropdown active'))));
  }

  waitForSelectDropdowntoDisappear() {
    element(by.className('cui-virtual-scroll-content-wrapper')).all(by.tagName('div')).first().click();
  }

  getDropdownOption(index) {
    return element(by.className('cui-virtual-scroll-content-wrapper')).all(by.tagName('div')).get(index);
  }
}
