import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getPagesDiv() {
    return element(by.css('fin-root div.pages')).getText();
  }
}
