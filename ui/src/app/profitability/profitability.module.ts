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
import {RuleService} from './services/rule.service';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from '../shared/components/main/main.component';
import {ProfitabilityRoutingModule} from './profitability-routing.module';


@NgModule({
  imports: [
    CommonModule,
    ProfitabilityRoutingModule,
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
export class ProfitabilityModule {
  constructor() {
  }
}
