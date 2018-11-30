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
  }

}

