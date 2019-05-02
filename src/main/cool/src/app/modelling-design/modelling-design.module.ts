import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

import { MenuBarModule } from '@app/menu/menu-bar.module';
import { TaskBarModule } from '../taskbar/task-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';

import { StatusComponent } from './status/status.component';
import { AtoListComponent } from './ato-list/ato-list.component';
import { ModellingDesignComponent } from './modelling-design.component';
import { TaskSummaryComponent } from './task-summary/task-summary.component';

import * as _ from 'lodash';

const routes: Routes = [
  {
    path: '',
    component: ModellingDesignComponent
  },
];

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
    RouterModule.forChild(routes)
  ]
})
export class ModellingDesignModule { }
