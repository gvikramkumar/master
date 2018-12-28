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
import { DashboardService } from './services/dashboard.service';
import { ActionsService } from './services/actions.service';
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
import { StrategyReviewComponent } from './strategy-review/strategy-review.component';
import { ExitCriteriaValidationComponent } from './exit-criteria-validation/exit-criteria-validation.component';
import {ExitCriteriaValidationService} from './services/exit-criteria-validation.service';
import { StakeholderFullComponent } from './stakeholder-full/stakeholder-full.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {MenuItem} from 'primeng/api';
import { CreateNewActionComponent } from './create-new-action/create-new-action.component';
import { ActionsComponent } from './actions/actions.component';
import { OfferCreateDetailComponent } from './offer-create-detail/offer-create-detail.component';
import {MenuModule} from 'primeng/menu';
import { AccessManagementComponent } from './access-management/access-management.component';
import { AvatarComponent } from './directives/avatar/avatar.component';
import { AccessManagementService } from './services/access-management.service';
import { EnvironmentService } from '../environments/environment.service';
import { MenuBarPopupComponent } from './menu-bar-popup/menu-bar-popup.component';
import { MenuBarService } from './services/menu-bar.service'
import { BupmGuard } from './auth/gaurds/bupm-guard';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { CreateActionService } from './services/create-action.service';
import { StakeholderfullService } from './services/stakeholderfull.service';

export function app_init(configService: ConfigurationService,userService: UserService, envService: EnvironmentService ){
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
    MenuBarComponent,
    StrategyReviewComponent,
    CreateNewActionComponent,
    ActionsComponent,
    OfferCreateDetailComponent,
    AccessManagementComponent,
    AvatarComponent,
    MenuBarPopupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
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
    EnvironmentService,
    MonetizationModelService,
    OfferDetailViewService,
    ExitCriteriaValidationService,
    DashboardService,
    ActionsService,
    StakeholderfullService,
    AccessManagementService,
    BupmGuard,
    CreateActionService,
    UserService,
    MenuBarService,
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
