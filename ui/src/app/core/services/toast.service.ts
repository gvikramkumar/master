import { Injectable } from '@angular/core';
import {AppStore} from '../../app/app-store';
import {CuiToastComponent} from '@cisco-ngx/cui-components';
import {MatDialog, MatSnackBar} from '@angular/material';

export enum ToastSeverity {
  info = 'info',
  success = 'success',
  warning = 'warning',
  danger = 'danger'
}

export enum ToastPadding {
  regular = 'regular',
  compressed = 'compressed',
  loose = 'loose'
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  permToast: CuiToastComponent;
  autoHideToast: CuiToastComponent;


  constructor(private store: AppStore, toast: MatSnackBar) {
  }

/*
  showPermToast(title, message, severity = ToastSeverity.info) {
    this.permToast.addToast(severity, title, message);
  }

  showAutoHideToast(title, message, severity = ToastSeverity.info) {
    this.autoHideToast.addToast(severity, title, message);
*/



    /* cui toast
      showPermToast(title, message, severity = ToastSeverity.info) {
        this.permToast.addToast(severity, title, message);
      }

      showAutoHideToast(title, message, severity = ToastSeverity.info) {
        this.autoHideToast.addToast(severity, title, message);
      }
    */

}
