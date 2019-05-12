import {$, $$, browser, element, by, ElementFinder, protractor} from 'protractor';
import * as _ from 'lodash';
import * as cp from 'child_process';

export class CommonPO {
  rootUrl = 'http://localhost:4201/';
  selectOptions = $$('mat-option');


  clickAutoCompleteOption(val) {
    $(`mat-option[ng-reflect-value="${val}"]`).click();
  }

  clickSelectOption(val) {
    $(`mat-option[value="${val}"]`).click();
  }

  isActiveElement(elem) {
    return elem.equals(browser.driver.switchTo().activeElement());
  }

  resizeWindow(width, height?) {
    browser.driver.manage().window().setSize(width, height || 1024);
  }

  refreshDbAndPage() {
    browser.call(this.initDatabase);
    browser.refresh();
  }

  refreshDbAndSetPage(url) {
    browser.call(this.initDatabase);
    browser.get(url);
  }

  initDatabase(): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = cp.exec('./initdbunit.sh', {cwd: '../contacts-be'}, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        console.log(stdout);
        resolve(stdout);
      });

    });
  }

  hasClass(elem, cls) {
    return elem.getAttribute('class').then(function (classes) {
      return classes.split(' ').indexOf(cls) !== -1;
    });
  }

  /*

// don't need this, this is handled by browser.waitForAngularEnabled=true and browser.ignoreSynchronization=false (in config.onPrepare)
// you had turned off waitForAngularEnabled to get $$().map working for getNames() function,
// but it's all working now with these 2 settings above
  navigate(url) {
    browser.get(url);
    // browser.wait(this.contactListInitialized());
  }

// don't need this, this is handled by browser.waitForAngularEnabled=true and browser.ignoreSynchronization=false (in config.onPrepare)
// you had turned off waitForAngularEnabled to get $$().map working for getNames() function,
// but it's all working now with these 2 settings above
  refresh() {
    browser.refresh();
    // browser.wait(this.contactListInitialized());
  }

// throttle will return the last returned value until the function is run again
private appInitialized() {
  return _.throttle(() => {
      return browser.executeScript('return !!window.dkAppInitialized');
    },
    500, {leading: true, trailing: false});
}

private contactListInitialized() {
  return _.throttle(() => {
      return browser.executeScript('return !!window.dkContactListInitialized');
    },
    500, {leading: true, trailing: false});
}


*/

}


