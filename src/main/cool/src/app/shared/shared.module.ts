import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterModule } from '@angular/router';
import {
  DataTableModule, MultiSelectModule, AccordionModule, TooltipModule, OverlayPanelModule,
  DialogModule,
  AutoCompleteModule
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { DashboardService, CreateOfferService, ViewcommentService, TurbotaxService } from './services';

import {
  StatusComponent,
  AtoListComponent,
  ViewOfferComponent,
  ViewcommentComponent,
  TurbotaxviewComponent,
  DynamicFormMultipleComponent
} from './components';


@NgModule({
  declarations: [
    StatusComponent,
    AtoListComponent,
    ViewOfferComponent,
    ViewcommentComponent,
    TurbotaxviewComponent,
    DynamicFormMultipleComponent,
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
    DashboardService,
    CreateOfferService,
    ViewcommentService,
    TurbotaxService
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
    TurbotaxviewComponent,
    DynamicFormMultipleComponent,
  ]
})
export class SharedModule { }
