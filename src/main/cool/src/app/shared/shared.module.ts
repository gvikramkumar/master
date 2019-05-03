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
import { ViewcommentComponent, TurbotaxviewComponent } from './components';
import { DashboardService, CreateOfferService, ViewcommentService, TurbotaxService } from './services';
import { DynamicFormMultipleComponent } from './components/dynamic-form-multiple/dynamic-form-multiple';


@NgModule({
  declarations: [
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
    ViewcommentComponent,
    TurbotaxviewComponent,
    DynamicFormMultipleComponent,
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
    BsDatepickerModule,
    AutoCompleteModule
  ]
})
export class SharedModule { }
