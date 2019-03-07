import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
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
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { OfferDetailViewComponent } from './offer-detail-view/offer-detail-view.component';
import { OfferDetailViewService } from './services/offer-detail-view.service';
import { StrategyReviewComponent } from './strategy-review/strategy-review.component';
import { ExitCriteriaValidationComponent } from './exit-criteria-validation/exit-criteria-validation.component';
import { ExitCriteriaValidationService } from './services/exit-criteria-validation.service';
import { StakeholderFullComponent } from './stakeholder-full/stakeholder-full.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { OfferCreateDetailComponent } from './offer-create-detail/offer-create-detail.component';
import { MenuModule } from 'primeng/menu';
import { AccessManagementComponent } from './access-management/access-management.component';
import { AccessManagementService } from './services/access-management.service';
import { MenuBarPopupComponent } from './menu-bar-popup/menu-bar-popup.component';
import { MenuBarService } from './services/menu-bar.service';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { CreateActionService } from './services/create-action.service';
import { StakeholderfullService } from './services/stakeholderfull.service';
import { OfferPhaseService } from './services/offer-phase.service';
import { OfferOverViewResolver } from './services/offer-overview-resolver.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
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
import { OffersolutioningCardOneComponent } from './offer-solutioning-card-one/offersolutioning-card-one.component';
import { OfferDimensionComponent } from './offer-dimension/offer-dimension.component';
import { MessageService } from './services/message.service';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { UserIdleModule } from 'angular-user-idle';
import { OfferConstructComponent } from './offer-construct/offer-construct.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';
import { OfferconstructCanvasComponent } from './offer-construct-canvas/offerconstruct-canvas.component';
import { DragDropModule } from 'primeng/dragdrop';
import { TreeTableModule } from 'primeng/treetable';
import { BlueComponent } from './blue/blue.component';
import { RightPanelService } from './services/right-panel.service';
import { OffersolutioningService } from './services/offersolutioning.service';
import { OfferSolutionQuestionComponent } from './offer-solution-question/offer-solution-question.component';
import { EditfieldsComponent } from './editfields/editfields.component';
import { ViewstrategyComponent } from './viewstrategy/viewstrategy.component';
import { OasComponent } from './oas/oas.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IdpidValidatorDirective } from './create-offer-cool/idpid-validator.directive';
import { DynamicFormMultipleComponent } from './offer-construct-canvas/dynamic-form-multiple';
import { NotificationOfferDetailPopupComponent } from './notification-offer-detail-popup/notification-offer-detail-popup.component';
import { DesignreviewComponent } from './designreview/designreview.component';
import SharedModule from '@shared/shared.module';
import { EnvironmentService } from 'src/environments/environment.service';
import { ConfigurationService, HttpInterceptorService, UserService } from '@shared/services';
import { DesignReviewExitCriteriaComponent } from '@shared/components';


export function app_init(configService: ConfigurationService) {
  return () => { return configService.init(); };
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
    AccessManagementComponent,
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
    BlueComponent,
    OfferSolutionQuestionComponent,
    EditfieldsComponent,
    ViewstrategyComponent,
    OasComponent,
    IdpidValidatorDirective,
    NotificationOfferDetailPopupComponent,
    DesignreviewComponent,
    DesignReviewExitCriteriaComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    HttpClientModule,
    RouterModule,
    MenuModule,
    AppRoutingModule,
    ClickOutsideModule,
    PerfectScrollbarModule,
    ModalModule.forRoot(),
    NgbModule.forRoot(),
    BrowserAnimationsModule,
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
