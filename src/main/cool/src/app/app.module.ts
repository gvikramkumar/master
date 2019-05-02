
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthErrorComponent } from './auth-error/auth-error.component';

import { AppRoutingModule } from './app-routing.module';
import { DesignReviewComponent } from '@app/review/design-review/design-review.component';
import { ViewStrategyComponent } from '@app/review/view-strategy/view-strategy.component';
import { StrategyReviewComponent } from '@app/review/strategy-review/strategy-review.component';
import { ExitCriteriaValidationComponent } from '@app/review/exit-criteria-validation/exit-criteria-validation.component';
import { DesignReviewExitCriteriaComponent } from '@app/review/design-review-exit-criteria/design-review-exit-criteria.component';

import { SharedService } from './shared-service.service';
import { ActionsService } from './services/actions.service';
import { MenuBarService } from './services/menu-bar.service';
import { OfferPhaseService } from './services/offer-phase.service';
import { RightPanelService } from './services/right-panel.service';
import { CreateActionService } from './services/create-action.service';
import { StrategyReviewService } from './services/strategy-review.service';
import { StakeholderfullService } from './services/stakeholderfull.service';
import { OfferDetailViewService } from './services/offer-detail-view.service';
import { AccessManagementService } from './services/access-management.service';
import { OffersolutioningService } from './services/offersolutioning.service';
import { MonetizationModelService } from './services/monetization-model.service';
import { SearchCollaboratorService } from './services/search-collaborator.service';
import { OfferOverViewResolver } from './services/offer-overview-resolver.service';
import { ExitCriteriaValidationService } from './services/exit-criteria-validation.service';


import { EnvironmentService } from 'src/environments/environment.service';
import { ConfigurationService, HttpInterceptorService } from '@core/services';


import { MessageService } from './services/message.service';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { UserIdleModule } from 'angular-user-idle';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from './menu/menu-bar.module';
import { TaskBarModule } from './taskbar/task-bar.module';
import { RightPanelModule } from './right-panel/right-panel.module';
import { OfferDetailModule } from './offer-detail/offer-detail.module';

import { CustomMinValidatorDirective } from './validators/custom-min-validator.directive';
import { CustomRangeValidatorDirective } from './validators/custom-range-validator.directive';
import { ItemCreationComponent } from './item-creation/item-creation.component';
import { ReviewEditForm } from './item-creation/review-edit-form/review-edit-form';
import { TreeTableModule, AutoCompleteModule } from 'primeng/primeng';


export function app_init(configService: ConfigurationService) {
  return () => configService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    StrategyReviewComponent,
    AuthErrorComponent,
    ViewStrategyComponent,
    DesignReviewComponent,
    ExitCriteriaValidationComponent,
    DesignReviewExitCriteriaComponent,
    CustomMinValidatorDirective,
    CustomRangeValidatorDirective,
  ],
  imports: [
    NgbModule,
    BrowserModule,
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
    CoreModule,
    SharedModule,
    AppRoutingModule,
    TreeTableModule,
    AutoCompleteModule
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
      CreateActionService,
      OfferPhaseService,
      OfferOverViewResolver,
      StrategyReviewService,
      MessageService,
      MenuBarService,
      DatePipe,
      RightPanelService,
      OffersolutioningService,
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
