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
import { CreateOfferCoolComponent } from './create-offer-cool/create-offer-cool.component';
import { MmAssesmentComponent } from './mm-assesment/mm-assesment.component';
import { CreateNewOfferComponent } from './create-new-offer/create-new-offer.component';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchCollaboratorService } from './services/search-collaborator.service';
import { OfferDetailViewComponent } from './offer-detail-view/offer-detail-view.component';
import { OfferDetailViewService } from './services/offer-detail-view.service';
import { StrategyReviewComponent } from '@app/review/strategy-review/strategy-review.component';
import { ExitCriteriaValidationComponent } from '@app/review/exit-criteria-validation/exit-criteria-validation.component';
import { ExitCriteriaValidationService } from './services/exit-criteria-validation.service';
import { StakeholderFullComponent } from '@app/stakeholder/stakeholder-full/stakeholder-full.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { OfferCreateDetailComponent } from './offer-create-detail/offer-create-detail.component';
import { AccessManagementService } from './services/access-management.service';
import { MenuBarPopupComponent } from './menu-bar-popup/menu-bar-popup.component';
import { MenuBarService } from './services/menu-bar.service';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { CreateActionService } from './services/create-action.service';
import { StakeholderfullService } from './services/stakeholderfull.service';
import { OfferPhaseService } from './services/offer-phase.service';
import { OfferOverViewResolver } from './services/offer-overview-resolver.service';
import { StrategyReviewService } from './services/strategy-review.service';
import { OfferSolutioningComponent } from './offer-solutioning/offer-solutioning.component';
import { PackingComponent } from './offer-dimension-groups/packing/packing.component';
import { SupportComponent } from './offer-dimension-groups/support/support.component';
import { OfferPricingComponent } from './offer-dimension-groups/offer-pricing/offer-pricing.component';
import { BillingComponent } from './offer-dimension-groups/billing/billing.component';
import { ProgramComponent } from './offer-dimension-groups/program/program.component';
import { OfferBasicInfoComponent } from './offer-basic-info/offer-basic-info.component';
import { MmInfoBarComponent } from './mm-info-bar/mm-info-bar.component';
import { MmMessageBarComponent } from './mm-message-bar/mm-message-bar.component';
import { OffersolutioningCardOneComponent } from '@app/offer-solutioning-card-one/offer-solutioning-card-one.component';
import { OfferDimensionComponent } from './offer-dimension/offer-dimension.component';
import { MessageService } from './services/message.service';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { UserIdleModule } from 'angular-user-idle';
import { OfferConstructComponent } from './offer-construct/offer-construct.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';
import { OfferconstructCanvasComponent } from '@app/offer-construct-canvas/offer-construct-canvas.component';
import { RightPanelService } from './services/right-panel.service';
import { OffersolutioningService } from './services/offersolutioning.service';
import { OfferSolutionQuestionComponent } from './offer-solution-question/offer-solution-question.component';
import { EditfieldsComponent } from './editfields/editfields.component';
import { ViewStrategyComponent as ViewStrategyComponent } from '@app/review/view-strategy/view-strategy.component';
import { OasComponent } from './oas/oas.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DynamicFormMultipleComponent } from './offer-construct-canvas/dynamic-form-multiple';
import { NotificationOfferDetailPopupComponent } from './notification-offer-detail-popup/notification-offer-detail-popup.component';
import { DesignReviewComponent } from '@app/review/design-review/design-review.component';
import { SharedModule } from '@shared/shared.module';
import { EnvironmentService } from 'src/environments/environment.service';
import { ConfigurationService, HttpInterceptorService, UserService } from '@shared/services';
import { DesignReviewExitCriteriaComponent } from '@shared/components';
import { StakeholderAddComponent } from '@app/stakeholder/stakeholder-add/stakeholder-add.component';

import { CuiSearchModule, CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';
import { OfferconstructChildComponent } from './child_component/offerconstruct-child/offerconstruct-child.component';
import { OfferSetupComponent } from './offer-setup/offer-setup.component';
import { LoaderService } from '@shared/loader.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';

export function app_init(configService: ConfigurationService) {
  return () => configService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    DynamicFormMultipleComponent,
    DashboardComponent,
    CreateOfferCoolComponent,
    OfferSolutioningComponent,
    MmAssesmentComponent,
    CreateNewOfferComponent,
    RightPanelComponent,
    OfferDetailViewComponent,
    ExitCriteriaValidationComponent,
    StakeholderFullComponent,
    MenuBarComponent,
    StrategyReviewComponent,
    OfferCreateDetailComponent,
    MenuBarPopupComponent,
    AuthErrorComponent,
    OfferSolutioningComponent,
    PackingComponent,
    SupportComponent,
    OfferPricingComponent,
    BillingComponent,
    ProgramComponent,
    OfferBasicInfoComponent,
    MmInfoBarComponent,
    MmMessageBarComponent,
    OffersolutioningCardOneComponent,
    OfferDimensionComponent,
    OfferConstructComponent,
    DynamicFormQuestionComponent,
    OfferconstructCanvasComponent,
    OfferSolutionQuestionComponent,
    EditfieldsComponent,
    ViewStrategyComponent,
    OasComponent,
    NotificationOfferDetailPopupComponent,
    DesignReviewComponent,
    DesignReviewExitCriteriaComponent,
    StakeholderAddComponent,
    OfferconstructChildComponent,
    OfferSetupComponent,
    LoaderComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    CuiSearchModule,
    CuiTableModule,
    CuiPagerModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    ClickOutsideModule,
    PerfectScrollbarModule,
    ModalModule.forRoot(),
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    NgCircleProgressModule.forRoot(),
    FlexLayoutModule,
    NgxWebstorageModule.forRoot(),
    UserIdleModule.forRoot({ idle: 10, timeout: 600, ping: 0 }),
    SharedModule
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
