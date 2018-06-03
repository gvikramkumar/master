import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubmeasureComponent} from './submeasure/submeasure/submeasure.component';
import {SubmeasureAddComponent} from './submeasure/submeasure-add/submeasure-add.component';
import {RuleManagementComponent} from './rule-management/rule-management/rule-management.component';
import {RuleManagementEditComponent} from './rule-management/rule-management-edit/rule-management-edit.component';
import {SubmeasureUploadComponent} from './submeasure/submeasure-upload/submeasure-upload.component';
import {RuleManagementAssignComponent} from './rule-management/rule-management-assign/rule-management-assign.component';
import {BusinessUploadComponent} from './business-upload/business-upload/business-upload.component';
import {SharedModule} from '../shared/shared.module';
import {ProfitabilityRoutingModule} from './profitability-routing.module';
import {StoreProfitability} from './store/store-profitability';
import { ReportsComponent } from './reports/reports/reports.component';
import {DollarUploadService} from './services/dollar-upload.service';
import {MappingUploadService} from './services/mapping-upload.service';


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
    BusinessUploadComponent,
    ReportsComponent
  ],
  exports: [
    SubmeasureComponent,
    RuleManagementComponent,
    SubmeasureUploadComponent,
    SubmeasureAddComponent,
    RuleManagementEditComponent,
    RuleManagementAssignComponent,
    BusinessUploadComponent
  ],
  providers: [
    StoreProfitability,
    DollarUploadService,
    MappingUploadService]
})
export class ProfitabilityModule {
  constructor() {
  }
}
