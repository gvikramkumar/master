import {Component, Inject, OnInit} from '@angular/core';
import {DialogType} from '../../../core/models/ui-enums';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'fin-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss']
})
export class GenericDialogComponent implements OnInit {
  cancelText: string;
  submitText: string;


  constructor(public dialogRef: MatDialogRef<GenericDialogComponent>, @Inject(MAT_DIALOG_DATA) public  data: any) {
  }

  ngOnInit() {
    switch (this.data.mode) {
      case DialogType.yesNo:
        this.cancelText = 'No';
        this.submitText = 'Yes';
        break;
      case DialogType.okCancel:
        this.cancelText = 'Cancel';
        this.submitText = 'OK';
        break;
      default:
        this.submitText = 'OK';
        break;
    }

    if (this.data.data === null || (typeof this.data.data === 'object' && !Object.keys(this.data.data).length)) {
      this.data.data = undefined;
    } else if (this.data.data instanceof Date) {
      this.data.data = this.data.data.toISOString();
    } else if (typeof this.data.data === 'object' && !(this.data.data instanceof String)) {
      try {
        this.data.data = JSON.stringify(this.data.data, null, 2);
      } catch (e) {
        console.log('generic dialog: json.stringify failure');
      }
    }

    // this allows us to use html in message and data sections
    /*
        setTimeout(() => {
          document.querySelector('.modal__body .message').innerHTML = this.data.message;
          if (this.data.data) {
            document.querySelector('.modal__body .data').innerHTML = this.data.data;
          }
        });
    */

  }

}

