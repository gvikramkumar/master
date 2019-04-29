import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterModule } from '@angular/router';
import {
  DataTableModule, MultiSelectModule, AccordionModule, TooltipModule, OverlayPanelModule,
  DialogModule
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { NavigateComponent } from './components/navigate/navigate.component';
import { ViewcommentComponent, TurbotaxviewComponent } from './components';
import { DashboardService, CreateOfferService, ViewcommentService, TurbotaxService } from './services';


@NgModule({
  declarations: [
    ViewcommentComponent,
    TurbotaxviewComponent,
    NavigateComponent
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
    BsDatepickerModule.forRoot()
  ],
  providers: [
    DashboardService,
    CreateOfferService,
    ViewcommentService,
    TurbotaxService
  ],
  exports: [
    NavigateComponent,
    ViewcommentComponent,
    TurbotaxviewComponent,
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
    BsDatepickerModule
  ]
})
export class SharedModule { }
