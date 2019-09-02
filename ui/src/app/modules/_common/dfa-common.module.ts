import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SubmeasureEditComponent} from './submeasure/submeasure-edit/submeasure-edit.component';
import {BusinessUploadComponent} from './business-upload/business-upload/business-upload.component';
import {RuleManagementEditComponent} from './rule-management/rule-management-edit/rule-management-edit.component';
import {ReportsComponent} from './reports/reports/reports.component';
import {SubmeasureComponent} from './submeasure/submeasure/submeasure.component';
import {RuleManagementComponent} from './rule-management/rule-management/rule-management.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {MeasureComponent} from './admin/measure/measure/measure.component';
import {ApprovalComponent} from './admin/approval/approval.component';
import {MeasureEditComponent} from './admin/measure/measure-edit/measure-edit.component';
import {ProcessingDateInputComponent} from './admin/processing-date-input/processing-date-input.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [
    SubmeasureComponent,
    RuleManagementComponent,
    SubmeasureEditComponent,
    RuleManagementEditComponent,
    BusinessUploadComponent,
    ReportsComponent,
    MeasureComponent,
    MeasureEditComponent,
    ApprovalComponent,
    ProcessingDateInputComponent
  ],
  exports: [
    SharedModule,
    SubmeasureComponent,
    RuleManagementComponent,
    SubmeasureEditComponent,
    RuleManagementEditComponent,
    BusinessUploadComponent,
    MeasureComponent,
    MeasureEditComponent,
    ApprovalComponent,
    ProcessingDateInputComponent
  ]
})
export class DfaCommonModule { }
