import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubmeasureComponent} from '../dfa-common/submeasure/submeasure/submeasure.component';
import {SubmeasureEditComponent} from '../dfa-common/submeasure/submeasure-edit/submeasure-edit.component';
import {RuleManagementComponent} from '../dfa-common/rule-management/rule-management/rule-management.component';
import {RuleManagementEditComponent} from '../dfa-common/rule-management/rule-management-edit/rule-management-edit.component';
import {BusinessUploadComponent} from '../dfa-common/business-upload/business-upload/business-upload.component';
import {SharedModule} from '../shared/shared.module';
import {PrdtRoutingModule} from './prdt-routing.module';
import {ReportsComponent} from '../dfa-common/reports/reports/reports.component';


@NgModule({
  imports: [
    CommonModule,
    PrdtRoutingModule,
    SharedModule
  ],
  declarations: [
    SubmeasureComponent,
    RuleManagementComponent,
    SubmeasureEditComponent,
    RuleManagementEditComponent,
    BusinessUploadComponent,
    ReportsComponent
  ],
  exports: [
    SubmeasureComponent,
    RuleManagementComponent,
    SubmeasureEditComponent,
    RuleManagementEditComponent,
    BusinessUploadComponent
  ]
})
export class PrdtModule {
  constructor() {
  }
}
