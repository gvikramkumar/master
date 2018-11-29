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
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateOfferCoolComponent } from './create-offer-cool/create-offer-cool.component';
import { MmAssesmentComponent } from './mm-assesment/mm-assesment.component';
import { CreateNewOfferComponent } from './create-new-offer/create-new-offer.component';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { CreateOfferService } from './services/create-offer.service';
import { DataTableModule, DropdownModule, MultiSelectModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SearchCollaboratorService} from './services/search-collaborator.service';
import {TableModule} from 'primeng/table';
import {UserService} from './services/user.service';
import { ConfigurationService } from './services/configuration.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    CreateOfferCoolComponent,
    MmAssesmentComponent,
    CreateNewOfferComponent,
    RightPanelComponent
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
    TableModule
  ],
  providers: 
  [
    SharedServiceService, 
    CreateOfferService, 
    SearchCollaboratorService, 
    UserService,
    ConfigurationService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (config: ConfigurationService) => () => config.init(),
      deps: [ConfigurationService, UserService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
