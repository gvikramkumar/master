import {Injectable, ViewContainerRef} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import * as _ from 'lodash';
import {DialogSize, DialogType} from '../models/ui-enums';
import {AppStore} from '../../app/app-store';
import {CuiDialogConfig, CuiDialogRef, CuiDialogService} from '@cisco-ngx/cui-components';
import {GenericDialogComponent} from '../../shared/dialogs/generic-dialog/generic-dialog.component';
import {Observable} from 'rxjs/Observable';
import {CuiDialogRole} from '@cisco-ngx/cui-components/dist/cui-dialog/cui-dialog-config';
import {PromptDialogComponent} from '../../shared/dialogs/prompt-dialog/prompt-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class UiUtil {

  constructor(private store: AppStore, private dialogService: CuiDialogService) {
  }

  /*
    approvedOnce is no help here as we can have draft mode status D and approvedOnce
    copy or add >> add
    edit >> I/A and editMode >> add
    edit >> D/P and editMode >> update
  */
  static getApprovalSaveMode(status, add, edit, copy) {
    if ((add || copy)) {
      return 'add';
    } else if (edit && _.includes(['A', 'I'], status)) {
      return 'copy';
    } else if ((edit && _.includes(['D', 'P'], status))) {
      return 'update';
    }
  }

  static waitForPending(form, resolve) {
    if (form.status === 'PENDING') {
      // console.log('waiting...');
      setTimeout(UiUtil.waitForPending.bind(null, form, resolve), 100);
    } else {
      resolve();
    }
  }

  static waitForAsyncValidations(form) {
    return new Promise((resolve, reject) => {
      UiUtil.waitForPending(form, resolve);
    });
  }

  static triggerBlur(selector) {
    const query = `${selector} input, ${selector} select, ${selector} textarea`;
    _.forEach(document.querySelectorAll(query), elem => {
      elem.dispatchEvent(new Event('blur'));
    });
  }
  
  static getStatusText(status) {
    switch (status) {
      case 'A':
        return 'Active';
      case 'I':
        return 'Inactive';
      case 'P':
        return 'Pending';
      case 'D':
        return 'Draft';
    }
    if (!status) {
      return '';
    } else {
      throw new Error(`getStatusText: status doesn't exist: ${status}`);
    }
  }
  
  static statusIsActive(val) {
    return val === 'A';
  }

  static statusIsInactive(val) {
    return val === 'I';
  }

  static statusIsPending(val) {
    return val === 'P';
  }

  static approvedOnceAI(approvedOnce, status) {
    return (approvedOnce === 'Y') && (status === 'A' || status === 'I');
  }

  static getFiscalMonthListFromDate(date, numMonths) {
    const yearmos = [];
    const curMonths = _.range(date.getMonth(), date.getMonth() - numMonths);
    const fisMonths = _.range(date.getMonth() + 5, date.getMonth() + 5 - numMonths);

    for (let i = 0; i < numMonths; i++) {
      const curDate = new Date(date.getTime());
      const fisDate = new Date(date.getTime());
      curDate.setMonth(curMonths[i]);
      const curYear = curDate.getFullYear();
      const curMonthNum = curDate.getMonth() + 1;
      const curMonthName = this.getMonthNameFromNum(curMonthNum);
      fisDate.setMonth(fisMonths[i]);
      const fisYear = fisDate.getFullYear();
      const fisMonth = fisDate.getMonth() + 1;
      const fisYearMoStr = '' + fisYear + (fisMonth < 10 ? '0' + fisMonth : fisMonth)
      const fisYearMoNum = Number(fisYearMoStr);
      const yearMoMoYear = `${fisYearMoStr} ${curMonthName} FY${fisYear}`;
      yearmos.push({
        // curYear,
        // curMonthNum,
        // curMonthName,
        // fisYear,
        // fisMonth,
        str: fisYearMoStr,
        num: fisYearMoNum,
        long: yearMoMoYear
      });
    }

    return yearmos;
  }

  static getMonthNameFromNum(mon) {
    const months = {
      '1': 'Jan',
      '2': 'Feb',
      '3': 'Mar',
      '4': 'Apr',
      '5': 'May',
      '6': 'Jun',
      '7': 'Jul',
      '8': 'Aug',
      '9': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec',
    };
    return months[mon.toString()];
  }

  static screenHeightShort(elem) {
  }

  static createHttpParams(_params) {
    let params = new HttpParams();
    _.forEach(_params, (val, key) => {
      params = params.set(key, _params[key]);
    })
    return params;
  }

  static submitForm(url, params) {

    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', url);
    form.setAttribute('target', '_blank');

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', params[key]);
        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
    setTimeout(() => document.body.removeChild(form));
  }

  // instance methods (must be after static methods)


  /*
  export declare class CuiDialogConfig<D = any> {
  viewContainerRef?: ViewContainerRef;
  id?: string;
  role?: CuiDialogRole;
  hasBackdrop?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: null | string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  data?: D | null;
  autoFocus?: boolean;
  animated?: boolean;
  hostClass?: string;
  }
   */
  // can be with or without title, defaults to "OK"
  // returns true if submit button hit, undefined if not. Have to subscribe, THEN check for response,
  // no response, then canceled, if true (truthy) then they hit ok/yes. so:
  // this.uiUtil.genericDialog(message).subscribe(resp => {if (resp) { they hit ok, do your work}
  genericDialog(message: string, data = null, title = null, mode = DialogType.ok, size = DialogSize.small): Observable<any> {
    const config = {
      width: size,
      hasBackdrop: false, // we get a gray film over all if hasBackdrop=true(default).
      // Not sure why, cdk or cui? Could be material messing it up? Added an issue in cui-components
      animated: false,
      data: {message, title, mode, data},
    };
    return this.dialogService.open(GenericDialogComponent, <CuiDialogConfig>config)
      .afterCuiDialogClosed();
  }

  promptDialog(message: string, data = null, title = null, mode = DialogType.ok, size = DialogSize.small): Observable<any> {
    const config = {
      width: size,
      hasBackdrop: false, // we get a gray film over all if hasBackdrop=true(default).
      // Not sure why, cdk or cui? Could be material messing it up? Added an issue in cui-components
      animated: false,
      data: {message, title, mode, data},
    };
    return this.dialogService.open(PromptDialogComponent, <CuiDialogConfig>config)
      .afterCuiDialogClosed();
  }

  validationErrorsDialog(errors) {
    return this.genericDialog('Validation Errors', errors.join('\n'));
  }

  confirmSave() {
    return this.genericDialog('Are you sure you want to save?', null, null, DialogType.yesNo);
  }

  confirmDelete() {
    return this.genericDialog('Are you sure you want to delete?', null, null, DialogType.yesNo);
  }

  confirmSubmitForApproval() {
    return this.genericDialog('Are you sure you want to submit for approval?', null, null, DialogType.yesNo);
  }

  confirmApprove() {
    return this.promptDialog('Add approval comments: ', null, null, DialogType.okCancel);
  }

  confirmReject() {
    return this.promptDialog('Enter a reason for rejection: ', null, null, DialogType.okCancel);
  }

  errorDialog(errors) {
    return this.genericDialog('Errors', errors);
  }

}



