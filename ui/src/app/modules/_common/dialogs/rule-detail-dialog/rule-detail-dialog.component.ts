import {Component, Inject, OnInit} from '@angular/core';
import {DialogType} from '../../../../core/models/ui-enums';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'fin-rule-detail-dialog',
  templateUrl: './rule-detail-dialog.component.html',
  styleUrls: ['./rule-detail-dialog.component.scss']
})
export class RuleDetailDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RuleDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public  data: any) {
  }

  ngOnInit() {
    if (this.data.data === null || (typeof this.data.data === 'object' && !Object.keys(this.data.data).length)) {
      this.data.data = undefined;
    } else if (this.data.data instanceof Date) {
      this.data.data = this.data.data.toISOString();
    } else if (typeof this.data.data === 'object' && !(this.data.data instanceof String)) {
      try {
        this.data.data = JSON.stringify(this.data.data, null, 2);
      } catch (e) {
        console.log('rule detail dialog: json.stringify failure');
      }
    }
  }

}

