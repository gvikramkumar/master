import {$, $$, browser, element, by, ElementFinder, protractor} from 'protractor';
import * as _ from 'lodash';
import * as cp from 'child_process';
import * as request from 'request';
import * as os from 'os';

export class CommonPO {
  pageUrl: string;
  container = element(by.className(`fin-container`));
  table = element(by.className(`mat-table`));
  form = element(by.className('edit-form-container'));
  dialog = element(by.className(`mat-dialog-container`));

  EC = protractor.ExpectedConditions;

  constructor(_pageUrl) {
    this.pageUrl = _pageUrl;
  }

  finJsonRequest(_url, method, payload, queryString, _options = {}): any {
    const options = {
      url: `http://${os.hostname()}:3001${_url}`,
      method,
      body: payload,
      json: true,
      qs: queryString || {}
    };
    Object.assign(options, _options);
    return new Promise((resolve, reject) => {
      request(options, (err, resp, body) => {
        if (err) {
          reject(new Error('Request error.'));
        }
        resolve({resp, body});
      });
    });
  }

  // template method
  init() {
  }

  navigateTo() {
    browser.get(this.pageUrl);
    this.init();
  }

  pageRefresh() {
    browser.refresh();
    this.init();
  }

  mouseDownOnElement(_element) {
    browser.actions().mouseDown(_element).perform();
  }

  waitForPageToLoad() {
    browser.wait(this.EC.presenceOf(this.container));
  }

  // Table functions
  waitForTableToLoad() {
    browser.wait(this.EC.presenceOf(this.table));
  }

  getSearchField() {
    return element.all(by.className(`mat-input-element`)).first();
  }

  async getCountOfItemsLoadedInTheTable() {
    const range = await element(by.className(`mat-paginator-range-label`)).getText();
    return Number(range.substr(range.indexOf('f') + 2));
  }

  getTableRows() {
    return element.all(by.className(`mat-cell`));
  }

  getFirstCellInFirstRow() {
    return this.getTableRows().first().element(by.tagName(`a`));
  }

  // Form functions
  getFormTitle() {
    return element(by.tagName(`legend`));
  }

  waitForFormUp() {
    browser.wait(this.EC.presenceOf(this.form));
  }

  waitForFormDown() {
    browser.wait(this.EC.stalenessOf(this.form));
  }

  loadFormInEditMode(name) {
    this.getSearchField().sendKeys(name);
    this.getFirstCellInFirstRow().click();
    this.waitForFormUp();
  }

  getFormInputFieldByName(name, cuiElement?) {
    if (cuiElement) {
      return element(by.name(name));
    } else {
      return element(by.name(name)).element(by.className(`form-group__text`)).element(by.tagName('input'));
    }
  }

  getFormInputFieldByClassName(name, cuiElement?) {
    if (cuiElement) {
      return element(by.className(name));
    } else {
      return element(by.className(name)).element(by.className(`form-group__text`)).element(by.tagName('input'));
    }
  }

  getFormTextareaFieldByName(name, cuiElement?) {
    if (cuiElement) {
      return element(by.name(name));
    } else {
      return element(by.name(name)).element(by.className(`form-group__text`)).element(by.tagName('textarea'));
    }
  }

  getFormTextareaFieldByClassName(name, cuiElement?) {
    if (cuiElement) {
      return element(by.className(name));
    } else {
      return element(by.className(name)).element(by.className(`form-group__text`)).element(by.tagName('textarea'));
    }
  }

  getCheckBoxInputByName(name: string) {
    return element(by.name(name)).element(by.className(`checkbox`)).element(by.className(`checkbox__input`));
  }

  getCheckBoxLabelByName(name: string) {
    return element(by.name(name)).element(by.className(`checkbox`)).element(by.className(`checkbox__label`)).getText();
  }

  isCheckboxWithNameChecked(name: string) {
    return element(by.name(name)).element(by.className(`checkbox`)).element(by.tagName('input')).isSelected();
  }

  isCheckBoxWithNameDisabled(name: string) {
    return element(by.name(name)).element(by.className(`checkbox disabled`)).isPresent();
  }

  getCheckBoxInputByClassName(name: string) {
    return element(by.className(name)).element(by.className(`checkbox`)).element(by.className(`checkbox__input`));
  }

  getCheckBoxLabelByClassName(name: string) {
    return element(by.className(name)).element(by.className(`checkbox`)).element(by.className(`checkbox__label`)).getText();
  }

  isCheckboxWithClassNameChecked(name: string) {
    return element(by.className(name)).element(by.className(`checkbox`)).element(by.tagName('input')).isSelected();
  }

  isCheckBoxWithClassNameDisabled(name: string) {
    return element(by.className(name)).element(by.className(`checkbox disabled`)).isPresent();
  }

  // cui-select/multi-select
  openDropDownForSelectControl(name: string) {
    this.mouseDownOnElement(element(by.name(name)).element(by.className('dropdown-chevron icon-chevron-down')));
  }

  closeDropdown(name: string, offset) {
    browser.actions().mouseMove(element(by.name(name)), offset).click().perform();
  }

  clearDropdown(name: string) {
    this.mouseDownOnElement(element(by.name(name)).element(by.className('icon-close')));
  }

  getDropdownOption(index) {
    return element(by.className('cui-virtual-scroll-content-wrapper')).all(by.tagName('div')).get(index).element(by.tagName(`a`));
  }

  getErrorMessageForFormField(name: string) {
    return element(by.name(name)).element(by.className('help-block')).element(by.tagName('span')).getText();
  }

  // Form Buttons
  getAddButton() {
    return element(by.buttonText(`Add New`));
  }

  getSubmitButton() {
    return element(by.buttonText(`Submit`));
  }

  getCancelButton() {
    return element(by.buttonText(`Cancel`));
  }

  getResetButton() {
    return element(by.buttonText(`Reset`));
  }

  getYesButton() {
    return element(by.buttonText(`Yes`));
  }

  getNoButton() {
    return element(by.buttonText(`No`));
  }

  // Dialog functions
  waitForDialogToShow() {
    browser.wait(this.EC.presenceOf(this.dialog));
  }

  waitForDialogToHide() {
    browser.wait(this.EC.stalenessOf(this.dialog));
  }

  getDialogTitle() {
    return element(by.className(`mat-dialog-title`)).getText();
  }

  getDialogMessage() {
    return element(by.className(`fin-dialog-title`)).getText();
  }

  closeDialog() {
    element(by.buttonText('OK')).click();
    browser.wait(this.EC.stalenessOf(this.dialog));
  }




  /* rootUrl = 'http://localhost:4201/';
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
   }*/

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


