import {Injectable, ViewContainerRef} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import * as _ from 'lodash';
import {DialogInputType, DialogSize, DialogType} from '../models/ui-enums';
import {AppStore} from '../../app/app-store';
import {CuiDialogConfig, CuiDialogRef, CuiDialogService} from '@cisco-ngx/cui-components';
import {GenericDialogComponent} from '../../shared/dialogs/generic-dialog/generic-dialog.component';
import {PromptDialogComponent} from '../../shared/dialogs/prompt-dialog/prompt-dialog.component';
import {RuleDetailDialogComponent} from '../../shared/dialogs/rule-detail-dialog/rule-detail-dialog.component';
import {SubmeasureDetailDialogComponent} from '../../shared/dialogs/submeasure-detail-dialog/submeasure-detail-dialog.component';
import {Observable} from 'rxjs';
import {
  MatDialog,
  MatDialogConfig,
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition
} from '@angular/material';
import {ToastSeverity} from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UiUtil {

  constructor(
    private store: AppStore,
    private dialogService:
      CuiDialogService,
    public dialog: MatDialog,
    private matToast: MatSnackBar) {
  }

  /*
    approvedOnce is no help here as we can have draft mode status D and approvedOnce
    copy or add >> add
    edit >> I/A and editMode >> add
    edit >> D/P and editMode >> update
  */

  static updateUrl(router, route, queryParams) {
    router.navigate([], {relativeTo: route, queryParamsHandling: 'merge', queryParams, replaceUrl: true});
  }

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
    // form.setAttribute('target', '_blank');

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

  toast(message, action = '') {

    const options: MatSnackBarConfig = {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: 'mat-snack-bar-override'
    };
    this.matToast.open(message, action, options);
  }

/*
  showPermToast(title, message, severity = ToastSeverity.info) {
    // this.permToast.addToast(severity, title, message);
  }

  showAutoHideToast(message, severity = ToastSeverity.info) {
    // this.autoHideToast.addToast(severity, title, message);
  }
*/

  genericDialog(message: string, data = null, title = null, mode = DialogType.ok, size = DialogSize.small): Observable<any> {
    if (this.dialog.openDialogs.length) {
      console.log('genericDialog: dialog already open');
      return;
    }

    const config = <MatDialogConfig> {
      data: {message, title, mode, data},
      width: size,
      backdropClass: 'bg-modal-backdrop'
    };
    return this.dialog.open(GenericDialogComponent, config)
      .afterClosed();
  }

  promptDialog(message: string, title = null, inputType = DialogInputType.input, size = DialogSize.small, rows = 4): Observable<any> {
    if (this.dialog.openDialogs.length) {
      console.log('genericDialog: dialog already open');
      return;
    }

    const config = <MatDialogConfig> {
      data: {message, title, inputType, rows},
      width: size,
      backdropClass: 'bg-modal-backdrop'
    };
    return this.dialog.open(PromptDialogComponent, config)
      .afterClosed();
  }

  ruleDetailDialog(rule, inputType = DialogInputType.input, size = DialogSize.small, rows = 4): Observable<any> {
    if (this.dialog.openDialogs.length) {
      console.log('genericDialog: dialog already open');
      return;
    }

    const config = <MatDialogConfig> {
      data: rule,
      width: size,
      backdropClass: 'bg-modal-backdrop'
    };
    return this.dialog.open(RuleDetailDialogComponent, config)
      .afterClosed();
  }

  submeasureDetailDialog(rule, inputType = DialogInputType.input, size = DialogSize.small, rows = 4): Observable<any> {
    if (this.dialog.openDialogs.length) {
      console.log('genericDialog: dialog already open');
      return;
    }

    const config = <MatDialogConfig> {
      data: rule,
      width: size,
      backdropClass: 'bg-modal-backdrop'
    };
    return this.dialog.open(SubmeasureDetailDialogComponent, config)
      .afterClosed();
  }

/*  approvalDialog(message: string, title = null, inputType = DialogInputType.input, size = DialogSize.large) {
    if (this.dialog.openDialogs.length) {
      console.log('genericDialog: dialog already open');
      return;
    }

    const config = <MatDialogConfig> {
      data: {message, title, inputType},
      width: size,
      backdropClass: 'bg-modal-backdrop'
    };

    return this.dialog.open(ApprovalDialogComponent, config)
      .afterClosed();
  }*/

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
  /*
    genericDialogCui(message: string, data = null, title = null, mode = DialogType.ok, size = DialogSize.small): Observable<any> {
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

    promptDialogCui(message: string, title = null, inputType = DialogInputType.input, size = DialogSize.small, rows = 4): Observable<any> {
      const config = {
        width: size,
        hasBackdrop: false, // we get a gray film over all if hasBackdrop=true(default).
        // Not sure why, cdk or cui? Could be material messing it up? Added an issue in cui-components
        animated: false,
        data: {message, title, inputType, rows},
      };
      return this.dialogService.open(PromptDialogComponent, <CuiDialogConfig>config)
        .afterCuiDialogClosed();
    }
  */

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

  confirmApprove(type: string) {
    return this.genericDialog(`Are you sure you want to approve the ${type}?`, null, null, DialogType.yesNo);
  }

  confirmReject(type: string) {
    return this.genericDialog(`Are you sure you want to approve the ${type}?`, null, null, DialogType.yesNo);
  }

  errorDialog(errors) {
    return this.genericDialog('Errors', errors);
  }

}



