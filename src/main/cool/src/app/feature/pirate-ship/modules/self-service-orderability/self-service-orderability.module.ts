import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';
import { RightPanelModule } from '@app/feature/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/feature/offer-detail/offer-detail.module';

import * as _ from 'lodash';
import { SELF_SERVICE_ORDERABILITY_ROUTES } from './self-service-orderability.routes';

import { SelfServiceOrderabilityComponent } from './self-service-orderability.component';
import { SsoAtoSummaryComponent } from './components/sso-ato-summary/sso-ato-summary.component';
import { SsoAtoListComponent } from './components/sso-ato-list/sso-ato-list.component';
import { SsoStatusComponent } from './components/sso-status/sso-status.component';

@NgModule({

  declarations: [
    SsoAtoSummaryComponent,
    SelfServiceOrderabilityComponent,
    SsoAtoListComponent,
    SsoStatusComponent,
  ],
  imports: [
    SharedModule,
    TaskBarModule,
    MenuBarModule,
    RightPanelModule,
    OfferDetailModule,
    RouterModule.forChild(SELF_SERVICE_ORDERABILITY_ROUTES)
  ],
  exports: [
    RouterModule
  ]

})
export class SelfServiceOrderabilityModule { }
