import { Injectable } from '@angular/core';
import {AppStore} from '../../app/app-store';

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

  constructor(private store: AppStore) {
  }

  addPermToast(title, message, severity = ToastSeverity.info) {
    this.store.permToast.addToast(severity, title, message);
  }

  addAutoHideToast(title, message, severity = ToastSeverity.info) {
    this.store.autoHideToast.addToast(severity, title, message);
  }

}
