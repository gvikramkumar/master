import {Component, Inject, OnInit} from '@angular/core';
import {DialogType} from '../../../../core/models/ui-enums';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AllocationRule} from '../../../../../../../shared/models/allocation-rule';

@Component({
  selector: 'fin-rule-detail-dialog',
  templateUrl: './rule-detail-dialog.component.html',
  styleUrls: ['./rule-detail-dialog.component.scss']
})
export class RuleDetailDialogComponent {
  rule: AllocationRule;

  constructor(public dialogRef: MatDialogRef<RuleDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public  data: any) {
    this.rule = data;
  }


}

