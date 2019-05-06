import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import {
  DataTableModule, MultiSelectModule, AccordionModule, TooltipModule, OverlayPanelModule,
  DialogModule,
  AutoCompleteModule
} from 'primeng/primeng';

import { DashboardService, CreateOfferService, SharedService, TurbotaxService, ViewcommentService } from './services';


import {
  StatusComponent,
  AtoListComponent,
  ViewOfferComponent,
  ViewcommentComponent,
  TurbotaxviewComponent,
  ViewStrategyComponent,
  DynamicFormMultipleComponent
} from './components';

import { CustomMinValidatorDirective } from './validators/custom-min-validator.directive';
import { CustomRangeValidatorDirective } from './validators/custom-range-validator.directive';


@NgModule({
  declarations: [
    StatusComponent,
    AtoListComponent,
    ViewOfferComponent,
    ViewcommentComponent,
    ViewStrategyComponent,
    TurbotaxviewComponent,
    DynamicFormMultipleComponent,
    CustomMinValidatorDirective,
    CustomRangeValidatorDirective

  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TooltipModule,
    AccordionModule,
    OverlayPanelModule,
    TableModule,
    DialogModule,
    DataTableModule,
    MultiSelectModule,
    AutoCompleteModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    SharedService,
    TurbotaxService,
    DashboardService,
    CreateOfferService,
    ViewcommentService,
  ],
  exports: [
    FormsModule,
    CommonModule,
    TableModule,
    DialogModule,
    RouterModule,
    TooltipModule,
    AccordionModule,
    DataTableModule,
    MultiSelectModule,
    BsDatepickerModule,
    OverlayPanelModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    StatusComponent,
    AtoListComponent,
    ViewOfferComponent,
    ViewcommentComponent,
    ViewStrategyComponent,
    TurbotaxviewComponent,
    DynamicFormMultipleComponent,
  ]
})
export class SharedModule { }
