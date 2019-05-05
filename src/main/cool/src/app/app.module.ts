
import { DatePipe } from '@angular/common';
 import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthErrorComponent } from './auth-error/auth-error.component';

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
import { UserIdleModule } from 'angular-user-idle';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { MenuBarModule } from './menu/menu-bar.module';
import { TaskBarModule } from './taskbar/task-bar.module';
import { RightPanelModule } from './right-panel/right-panel.module';
import { OfferDetailModule } from './offer-detail/offer-detail.module';

export function app_init(configService: ConfigurationService) {
  return () => configService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AuthErrorComponent,
  ],
  imports: [
    NgbModule,
    RouterModule,
    BrowserModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    UserIdleModule.forRoot({ idle: 10, timeout: 600, ping: 0 }),
    CoreModule,
    SharedModule,
    MenuBarModule,
    TaskBarModule,
    RightPanelModule,
    OfferDetailModule,
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
