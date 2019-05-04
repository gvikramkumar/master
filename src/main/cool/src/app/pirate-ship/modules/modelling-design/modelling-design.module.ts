import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';

import { ModellingDesignComponent } from './modelling-design.component';
import { TaskSummaryComponent } from './components/task-summary/task-summary.component';

import * as _ from 'lodash';
import { MODELLING_DESIGN_ROUTES } from './modelling-design.routes';
import { StatusComponent } from '@app/pirate-ship/components/status/status.component';
import { AtoListComponent } from '@app/pirate-ship/components/ato-list/ato-list.component';

@NgModule({

  declarations: [
    StatusComponent,
    AtoListComponent,
    TaskSummaryComponent,
    ModellingDesignComponent,
  ],
  imports: [
    SharedModule,
    TaskBarModule,
    MenuBarModule,
    RightPanelModule,
    OfferDetailModule,
    RouterModule.forChild(MODELLING_DESIGN_ROUTES)
  ],
  exports: [
    RouterModule,
    StatusComponent,
    AtoListComponent,
  ]

})
export class ModellingDesignModule { }
