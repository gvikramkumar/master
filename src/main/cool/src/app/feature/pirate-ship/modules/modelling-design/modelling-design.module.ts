import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';
import { RightPanelModule } from '@app/feature/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/feature/offer-detail/offer-detail.module';

import { ModellingDesignComponent } from './modelling-design.component';
import { TaskSummaryComponent } from './components/task-summary/task-summary.component';

import * as _ from 'lodash';
import { MODELLING_DESIGN_ROUTES } from './modelling-design.routes';


@NgModule({

  declarations: [
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
    RouterModule
  ]

})
export class ModellingDesignModule { }
