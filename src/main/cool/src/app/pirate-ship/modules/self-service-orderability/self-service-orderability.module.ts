import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';

import * as _ from 'lodash';
import { SELF_SERVICE_ORDERABILITY_ROUTES } from './self-service-orderability.routes';

import { SelfServiceOrderabilityComponent } from './self-service-orderability.component';

@NgModule({

  declarations: [
    SelfServiceOrderabilityComponent
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
