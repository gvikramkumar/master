import {Component, Inject} from '@angular/core';
import {DialogInputType} from '../../../core/models/ui-enums';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'fin-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent {
  messageText = '';
  DialogInputType = DialogInputType;

  constructor(public dialogRef: MatDialogRef<PromptDialogComponent>, @Inject(MAT_DIALOG_DATA)public  data: any) {
  }

}

