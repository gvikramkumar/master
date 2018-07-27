import {Component, Inject, OnInit} from '@angular/core';
import {CUI_DIALOG_DATA, CuiDialogRef} from '@cisco-ngx/cui-components';
import {DialogType} from '../../../core/models/ui-enums';

@Component({
  selector: 'fin-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss']
})
export class GenericDialogComponent implements OnInit {
cancelText: string;
submitText: string;

  constructor(
    public dialogRef: CuiDialogRef<GenericDialogComponent>,
    @Inject(CUI_DIALOG_DATA) public data: any) {
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
    setTimeout(() => {
      document.querySelector('.modal__body .message').innerHTML = this.data.message;
      if (this.data.data) {
        document.querySelector('.modal__body .data').innerHTML = this.data.data;
      }
    });
  }

}

