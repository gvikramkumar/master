import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TaskbarComponent, AvatarComponent,
  StakeholderIdentificationComponent,
  FooterComponent,
  HeaderComponent,
  ViewcommentComponent,
  TurbotaxviewComponent
} from './components';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HeaderService, DashboardService, CreateOfferService, ViewcommentService, TurbotaxService } from './services';
import { RouterModule } from '@angular/router';
import { BupmGuard, AuthGuard } from './guards';
import { DataTableModule, DropdownModule, MultiSelectModule, AccordionModule, TooltipModule, OverlayPanelModule, FileUploadModule, DialogModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    AvatarComponent,
    StakeholderIdentificationComponent,
    TaskbarComponent,
    FooterComponent,
    HeaderComponent,
    ViewcommentComponent,
    TurbotaxviewComponent
  ],
  imports: [
    CommonModule,
    DataTableModule, DropdownModule, MultiSelectModule, FileUploadModule, TooltipModule, AccordionModule,
    OverlayPanelModule,
    DialogModule,
    RouterModule,BsDatepickerModule.forRoot(),
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
    AvatarComponent,
    StakeholderIdentificationComponent,
    TaskbarComponent,
    FooterComponent,
    HeaderComponent,
    ViewcommentComponent,
    TurbotaxviewComponent,
    DataTableModule, DropdownModule, MultiSelectModule, FileUploadModule, TooltipModule, AccordionModule,
    OverlayPanelModule, BsDatepickerModule,
    DialogModule, FormsModule, ReactiveFormsModule,
  ]
})
export default class SharedModule { }
