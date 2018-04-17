import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SubmeasureComponent} from './submeasure/submeasure/submeasure.component';
import {SubmeasureAddComponent} from './submeasure/submeasure-add/submeasure-add.component';
import {RuleManagementComponent} from './rule-management/rule-management/rule-management.component';
import {RuleManagementCreateComponent} from './rule-management/rule-management-create/rule-management-create.component';
import {SubmeasureUploadComponent} from './submeasure/submeasure-upload/submeasure-upload.component';
import {RuleManagementAssignComponent} from './rule-management/rule-management-assign/rule-management-assign.component';
import {RuleManagementUpdateComponent} from './rule-management/rule-management-update/rule-management-update.component';
import {BusinessUploadComponent} from './business-upload/business-upload/business-upload.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SubmeasureComponent,
    RuleManagementComponent,
    SubmeasureUploadComponent,
    SubmeasureAddComponent,
    RuleManagementCreateComponent,
    RuleManagementAssignComponent,
    RuleManagementUpdateComponent,
    BusinessUploadComponent
  ],
  exports: [
    SubmeasureComponent,
    RuleManagementComponent,
    SubmeasureUploadComponent,
    SubmeasureAddComponent,
    RuleManagementCreateComponent,
    RuleManagementAssignComponent,
    RuleManagementUpdateComponent,
    BusinessUploadComponent
  ],
})
export class ProfitabilityModule { }
