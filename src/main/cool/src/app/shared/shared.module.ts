import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HeaderService, DashboardService, CreateOfferService, ViewcommentService, TurbotaxService } from './services';
import { RouterModule } from '@angular/router';
import { BupmGuard, AuthGuard } from './guards';
import {
  DataTableModule, MultiSelectModule, AccordionModule, TooltipModule, OverlayPanelModule,
  DialogModule
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { FooterComponent, HeaderComponent, ViewcommentComponent, TurbotaxviewComponent } from './components';
import { NavigateComponent } from './components/navigate/navigate.component';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
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
