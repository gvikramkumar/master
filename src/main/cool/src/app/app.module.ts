
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


import { AppComponent } from './app.component';
import { DashboardComponent } from '@app/feature/dashboard/dashboard.component';

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
import { CsdlIntegrationService } from './services/csdl-integration.service';
import { ExitCriteriaValidationService } from './services/exit-criteria-validation.service';


import { EnvironmentService } from 'src/environments/environment.service';
import { ConfigurationService, HttpInterceptorService } from '@core/services';

import { MessageService } from './services/message.service';
import { UserIdleModule } from 'angular-user-idle';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';
import { RightPanelModule } from '@app/feature/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/feature/offer-detail/offer-detail.module';

import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from '@app/store/reducers';
import { CalendarModule } from 'primeng/calendar';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';


export function app_init(configService: ConfigurationService) {
  return () => configService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
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
    AppRoutingModule,
    CalendarModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : []
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
      CsdlIntegrationService,
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
