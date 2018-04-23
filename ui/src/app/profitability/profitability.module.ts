import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SubmeasureComponent} from './submeasure/submeasure/submeasure.component';
import {SubmeasureAddComponent} from './submeasure/submeasure-add/submeasure-add.component';
import {RuleManagementComponent} from './rule-management/rule-management/rule-management.component';
import {RuleManagementEditComponent} from './rule-management/rule-management-edit/rule-management-edit.component';
import {SubmeasureUploadComponent} from './submeasure/submeasure-upload/submeasure-upload.component';
import {RuleManagementAssignComponent} from './rule-management/rule-management-assign/rule-management-assign.component';
import {BusinessUploadComponent} from './business-upload/business-upload/business-upload.component';
import {SharedModule} from '../shared/shared.module';
import {RuleService} from '../core/services/profitability/rule.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    SubmeasureComponent,
    RuleManagementComponent,
    SubmeasureUploadComponent,
    SubmeasureAddComponent,
    RuleManagementEditComponent,
    RuleManagementAssignComponent,
    BusinessUploadComponent
  ],
  exports: [
    SubmeasureComponent,
    RuleManagementComponent,
    SubmeasureUploadComponent,
    SubmeasureAddComponent,
    RuleManagementEditComponent,
    RuleManagementAssignComponent,
    BusinessUploadComponent
  ]
})
export class ProfitabilityModule { }
