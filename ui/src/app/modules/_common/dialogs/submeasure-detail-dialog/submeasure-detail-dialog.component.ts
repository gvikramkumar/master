import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'fin-submeasure-detail-dialog',
  templateUrl: './submeasure-detail-dialog.component.html',
  styleUrls: ['./submeasure-detail-dialog.component.scss']
})
export class SubmeasureDetailDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SubmeasureDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public  data: any) {
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
        console.log('submeasure detail dialog: json.stringify failure');
      }
    }
  }


}

