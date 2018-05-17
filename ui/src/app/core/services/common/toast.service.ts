import { Injectable } from '@angular/core';
import {Store} from '../../../store/store';

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

@Injectable()
export class ToastService {

  constructor(private store: Store) {
  }

  addToast(title, message, severity = ToastSeverity.info) {
    this.store.toast.addToast(severity, title, message);
  }

}
