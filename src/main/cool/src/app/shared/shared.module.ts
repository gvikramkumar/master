import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import {
  DataTableModule, MultiSelectModule, AccordionModule, TooltipModule, OverlayPanelModule,
  DialogModule,
  AutoCompleteModule, ConfirmDialogModule
} from 'primeng/primeng';

import { DashboardService, CreateOfferService, SharedService, TurbotaxService, ViewcommentService } from './services';
import { ConfirmationService } from 'primeng/api';

import { CustomMinValidatorDirective } from './validators/custom-min-validator.directive';
import { CustomRangeValidatorDirective } from './validators/custom-range-validator.directive';
import { HiddenelemDirective } from '@shared/directives/hiddenelem.directive';
import { ReadonlyDirective } from '@shared/directives/readonly.directive';
import { ErrorpageComponent } from './components/errorpage/errorpage.component';
import {
  StatusComponent, AtoListComponent, ViewOfferComponent,
  ViewcommentComponent, ViewStrategyComponent, TurbotaxviewComponent,
  PirateShipLegendComponent, DynamicFormMultipleComponent
} from '@shared/components';


@NgModule({
  declarations: [
    StatusComponent,
    AtoListComponent,
    ViewOfferComponent,
    ViewcommentComponent,
    ViewStrategyComponent,
    TurbotaxviewComponent,
    PirateShipLegendComponent,
    DynamicFormMultipleComponent,
    CustomMinValidatorDirective,
    CustomRangeValidatorDirective,
    HiddenelemDirective,
    ReadonlyDirective,
    ErrorpageComponent,
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
    ConfirmDialogModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    SharedService,
    TurbotaxService,
    DashboardService,
    CreateOfferService,
    ViewcommentService,
    ConfirmationService
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
    PirateShipLegendComponent,
    DynamicFormMultipleComponent,
    HiddenelemDirective,
    ReadonlyDirective,
  ]
})
export class SharedModule { }
