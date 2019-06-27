import {Injectable, ViewContainerRef} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import _ from 'lodash';
import {DialogInputType, DialogSize, DialogType} from '../models/ui-enums';
import {AppStore} from '../../app/app-store';
import {GenericDialogComponent} from '../../shared/dialogs/generic-dialog/generic-dialog.component';
import {PromptDialogComponent} from '../../shared/dialogs/prompt-dialog/prompt-dialog.component';
import {RuleDetailDialogComponent} from '../../modules/_common/dialogs/rule-detail-dialog/rule-detail-dialog.component';
import {SubmeasureDetailDialogComponent} from '../../modules/_common/dialogs/submeasure-detail-dialog/submeasure-detail-dialog.component';
import {Observable} from 'rxjs';
import {
  MatDialog,
  MatDialogConfig,
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition, MatSnackBarRef
} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UiUtil {
  static alphanumRegex = `[A-Z0-9_\\- ]*`;
  static alphanumMessage = 'Only capital alphanumeric/underscore/dash/space allowed';
  toastRef: MatSnackBarRef<any>;

  constructor(
    private store: AppStore,
    public dialog: MatDialog,
    private matToast: MatSnackBar) {
  }

  // clear the object's property if not in list. Uses lodash "path" for obj and list
  // compares against values in a list, or a property in a list of objects
  static clearPropertyIfNotInList(obj, prop, list, listProp?) {
    if (!obj || !prop || !list) {
      console.error('uiUtil.clearPropertyIfNotInList called with no obj, prop, or list');
      return;
    }
    if (list.length && typeof list[0] === 'object' && !listProp) {
      console.error('uiUtil.clearPropertyIfNotInList called list of objects, but no listProp');
      return;
    }
    if (listProp) {
      if (_.findIndex(list, p => _.get(p, listProp) === _.get(obj, prop)) === -1) {
        _.unset(obj, prop);
      }
    } else if (_.indexOf(list, _.get(obj, prop)) === -1) {
      _.unset(obj, prop);
    }
  }

  static isValidFiscalMonth(strOrNum) {
    if (!strOrNum) {
      return false;
    }
    return /^\d{6}$/.test(strOrNum.toString().trim());
  }

  static updateUrl(router, route, queryParams) {
    router.navigate([], {relativeTo: route, queryParamsHandling: 'merge', queryParams, replaceUrl: true});
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

  static screenHeightShort(elem) {
  }

  static createHttpParams(_params) {
    let params = new HttpParams();
    _.forEach(_params, (val, key) => {
      params = params.set(key, _params[key]);
    });
    return params;
  }

  static submitForm(url, params) {

    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', url);
    // form.setAttribute('target', '_blank');

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', params[key].toString());
        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
    setTimeout(() => document.body.removeChild(form));
  }

  // instance methods (must be after static methods)

  canAdminApprove(id) {
    return this.store.user.isItAdmin() ? true : this.store.user.isModuleAdmin() && id !== this.store.user.id;
  }

  toast(message, action = '', duration?) {
    const options: MatSnackBarConfig = {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: duration ? duration : 5000,
      panelClass: 'mat-snack-bar-override'
    };
    this.toastRef = this.matToast.open(message, action, options);
  }

  toastHide() {
    if (this.toastRef) {
      this.toastRef.dismiss();
    }
  }

  toastPerm(message, action = '') {
    const year = 365 * 24 * 60 * 60 * 1000;
    this.toast(message, action, year); //
  }

  /*
      showPermToast(title, message, severity = ToastSeverity.info) {
        // this.permToast.addToast(severity, title, message);
      }

      showAutoHideToast(message, severity = ToastSeverity.info) {
        // this.autoHideToast.addToast(severity, title, message);
      }
    */

  genericDialog(message: string, data = null, title = null, mode = DialogType.ok, size = DialogSize.small, showPre = true, showVerboseErrorMessages = true): Observable<any> {
    if (this.dialog.openDialogs.length) {
      console.log('genericDialog: dialog already open');
      return;
    }

    const config = <MatDialogConfig> {
      data: {message, title, mode, showPre, data, showVerboseErrorMessages},
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
    return this.genericDialog(`Are you sure you want to reject the ${type}?`, null, null, DialogType.yesNo);
  }

  errorDialog(errors) {
    return this.genericDialog('Errors', errors);
  }

}



