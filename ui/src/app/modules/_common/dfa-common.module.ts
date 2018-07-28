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
import {MeasureComponent} from './measure/measure/measure.component';
import {MeasureEditComponent} from './measure/measure-edit/measure-edit.component';

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
  ]
})
export class DfaCommonModule { }
