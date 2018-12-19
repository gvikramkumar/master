import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ClickOutsideModule } from 'ng-click-outside';
import { AppRoutingModule } from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { SharedServiceService } from './shared-service.service';
import {MonetizationModelService} from './services/monetization-model.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateOfferCoolComponent } from './create-offer-cool/create-offer-cool.component';
import { MmAssesmentComponent } from './mm-assesment/mm-assesment.component';
import { CreateNewOfferComponent } from './create-new-offer/create-new-offer.component';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { CreateOfferService } from './services/create-offer.service';
import { DataTableModule, DropdownModule, MultiSelectModule, AccordionModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SearchCollaboratorService} from './services/search-collaborator.service';
import {TableModule} from 'primeng/table';
import {UserService} from './services/user.service';
import { ConfigurationService } from './services/configuration.service';
import {CalendarModule} from 'primeng/calendar';
import { OfferDetailViewComponent } from './offer-detail-view/offer-detail-view.component';
import { OfferDetailViewService } from './services/offer-detail-view.service';
import { ExitCriteriaValidationComponent } from './exit-criteria-validation/exit-criteria-validation.component';
import {ExitCriteriaValidationService} from './services/exit-criteria-validation.service';
import { StakeholderFullComponent } from './stakeholder-full/stakeholder-full.component';


import { MenuBarComponent } from './menu-bar/menu-bar.component';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {MenuItem} from 'primeng/api';



export function app_init(configService: ConfigurationService,userService: UserService ){
  return () => {return configService.init();};
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    CreateOfferCoolComponent,
    MmAssesmentComponent,
    CreateNewOfferComponent,
    RightPanelComponent,
    OfferDetailViewComponent,
    ExitCriteriaValidationComponent,
    StakeholderFullComponent,
  
    MenuBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ClickOutsideModule,
    PerfectScrollbarModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgbModule.forRoot(),
    MultiSelectModule,
    DialogModule,
    BrowserAnimationsModule,
    DataTableModule,
    DropdownModule,
    TableModule,
    CalendarModule,
    AccordionModule
  ],
  providers: 
  [
    SharedServiceService, 
    CreateOfferService, 
    SearchCollaboratorService, 
    ConfigurationService,
    MonetizationModelService,
    OfferDetailViewService,
    ExitCriteriaValidationService,

    UserService,
     {
       provide: APP_INITIALIZER,
       multi: true,
       useFactory: app_init,
       deps: [ConfigurationService]
     }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
