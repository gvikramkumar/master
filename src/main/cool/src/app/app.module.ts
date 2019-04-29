import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClickOutsideModule } from 'ng-click-outside';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActionsService } from './services/actions.service';
import { SharedService } from './shared-service.service';
import { MonetizationModelService } from './services/monetization-model.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchCollaboratorService } from './services/search-collaborator.service';

import { OfferDetailViewService } from './services/offer-detail-view.service';
import { StrategyReviewComponent } from '@app/review/strategy-review/strategy-review.component';
import { ExitCriteriaValidationComponent } from '@app/review/exit-criteria-validation/exit-criteria-validation.component';
import { ExitCriteriaValidationService } from './services/exit-criteria-validation.service';

import { AccessManagementService } from './services/access-management.service';
import { MenuBarService } from './services/menu-bar.service';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { CreateActionService } from './services/create-action.service';
import { StakeholderfullService } from './services/stakeholderfull.service';
import { OfferPhaseService } from './services/offer-phase.service';
import { OfferOverViewResolver } from './services/offer-overview-resolver.service';
import { StrategyReviewService } from './services/strategy-review.service';

import { OfferBasicInfoComponent } from './offer-basic-info/offer-basic-info.component';

import { MessageService } from './services/message.service';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { UserIdleModule } from 'angular-user-idle';
import { RightPanelService } from './services/right-panel.service';
import { OffersolutioningService } from './services/offersolutioning.service';
import { ViewStrategyComponent } from '@app/review/view-strategy/view-strategy.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DesignReviewComponent } from '@app/review/design-review/design-review.component';
import { SharedModule } from '@shared/shared.module';
import { EnvironmentService } from 'src/environments/environment.service';
import { ConfigurationService, HttpInterceptorService, UserService } from '@shared/services';


import { CuiSearchModule, CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';

import { LoaderService } from '@shared/loader.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';

import { CustomMinValidatorDirective } from './validators/custom-min-validator.directive';
import { CustomRangeValidatorDirective } from './validators/custom-range-validator.directive';
import { MenuBarModule } from './menu/menu-bar.module';
import { RightPanelModule } from './right-panel/right-panel.module';
import { OfferDetailModule } from './offer-detail/offer-detail.module';
import { DesignReviewExitCriteriaComponent } from './shared/components/design-review-exit-criteria/design-review-exit-criteria.component';
import { TaskBarModule } from './taskbar/task-bar.module';


export function app_init(configService: ConfigurationService) {
  return () => configService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ExitCriteriaValidationComponent,
    StrategyReviewComponent,
    AuthErrorComponent,
    OfferBasicInfoComponent,
    ViewStrategyComponent,
    DesignReviewComponent,
    DesignReviewExitCriteriaComponent,
    LoaderComponent,
    CustomMinValidatorDirective,
    CustomRangeValidatorDirective,

  ],
  imports: [
    NgbModule,
    BrowserModule,
    CuiSearchModule,
    CuiTableModule,
    CuiPagerModule,
    HttpClientModule,
    RouterModule,
    ClickOutsideModule,
    PerfectScrollbarModule,
    ModalModule.forRoot(),
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    NgCircleProgressModule.forRoot(),
    FlexLayoutModule,
    NgxWebstorageModule.forRoot(),
    UserIdleModule.forRoot({ idle: 10, timeout: 600, ping: 0 }),
    MenuBarModule,
    TaskBarModule,
    RightPanelModule,
    OfferDetailModule,
    SharedModule,
    AppRoutingModule
  ],
  providers:
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpInterceptorService,
        multi: true
      },
      ConfigurationService,
      SharedService,
      SearchCollaboratorService,
      EnvironmentService,
      MonetizationModelService,
      OfferDetailViewService,
      ExitCriteriaValidationService,
      ActionsService,
      StakeholderfullService,
      AccessManagementService,
      UserService,
      CreateActionService,
      OfferPhaseService,
      OfferOverViewResolver,
      StrategyReviewService,
      MessageService,
      MenuBarService,
      DatePipe,
      RightPanelService,
      OffersolutioningService,
      LoaderService,
      {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: app_init,
        deps: [ConfigurationService]
      }
    ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
