import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HeaderService, DashboardService, CreateOfferService, ViewcommentService, TurbotaxService } from './services';
import { RouterModule } from '@angular/router';
import { BupmGuard, AuthGuard } from './guards';
import {
  DataTableModule, DropdownModule, MultiSelectModule, AccordionModule, TooltipModule, OverlayPanelModule,
  FileUploadModule, DialogModule, MenuModule, CalendarModule, AutoCompleteModule, DragDropModule, TreeTableModule,
  CardModule, PanelModule, TabMenuModule, TieredMenuModule, ConfirmDialogModule, ButtonModule, CheckboxModule, ProgressSpinnerModule
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FooterComponent, HeaderComponent, ViewcommentComponent, TurbotaxviewComponent } from './components';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    ViewcommentComponent,
    TurbotaxviewComponent
  ],
  imports: [
    CommonModule,
    DataTableModule, DropdownModule, MultiSelectModule, FileUploadModule, TooltipModule, AccordionModule,
    OverlayPanelModule,
    MenuModule,
    TableModule,
    CalendarModule,
    AutoCompleteModule,
    DragDropModule,
    TreeTableModule,
    CardModule,
    PanelModule,
    TabMenuModule,
    TieredMenuModule,
    ConfirmDialogModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    ProgressSpinnerModule,
    DialogModule,
    RouterModule, BsDatepickerModule.forRoot(),
    FormsModule, ReactiveFormsModule
  ],
  providers: [
    HeaderService,
    DashboardService,
    CreateOfferService,
    BupmGuard,
    AuthGuard,
    ViewcommentService,
    TurbotaxService
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    ViewcommentComponent,
    TurbotaxviewComponent,
    DataTableModule, DropdownModule, MultiSelectModule, FileUploadModule, TooltipModule, AccordionModule,
    OverlayPanelModule, BsDatepickerModule,
    MenuModule,
    TableModule,
    CalendarModule,
    AutoCompleteModule,
    DragDropModule,
    TreeTableModule,
    CardModule,
    PanelModule,
    TabMenuModule,
    TieredMenuModule,
    ConfirmDialogModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    ProgressSpinnerModule,
    DialogModule, FormsModule, ReactiveFormsModule,
  ], schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
