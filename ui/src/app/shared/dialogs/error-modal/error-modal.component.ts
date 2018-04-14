import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'dk-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent {
  error: { message: string, status?: number, json?: any, data?: any };

  constructor(public dialogRef: MatDialogRef<ErrorModalComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.error = data.error;
    if (this.error.status >= 500) {
      this.error = {message: 'Well, this is embarrassing.'};
    } else if (this.error.message.toLowerCase() === 'unknown server error' &&
      (this.error.data && this.error.data.status === 0)) {
      this.error.message = 'Server is down.';
    }
  }

}
