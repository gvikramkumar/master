import { Injectable } from '@angular/core';
import {AppStore} from '../../app/app-store';
import {CuiToastComponent} from '@cisco-ngx/cui-components';

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


  constructor(private store: AppStore) {
  }

  addPermToast(title, message, severity = ToastSeverity.info) {
    this.permToast.addToast(severity, title, message);
  }

  addAutoHideToast(title, message, severity = ToastSeverity.info) {
    this.autoHideToast.addToast(severity, title, message);
  }

}
