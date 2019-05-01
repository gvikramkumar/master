import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

import * as _ from 'lodash';
import { TaskBarModule } from '../taskbar/task-bar.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';

import { AtoListComponent } from './ato-list/ato-list.component';
import { AtoMainComponent } from './ato-main/ato-main.component';
import { AtoStatusComponent } from './ato-status/ato-status.component';
import { AtoSummaryComponent } from './ato-summary/ato-summary.component';


const routes: Routes = [
  {
    path: '',
    component: AtoMainComponent
  },
];

@NgModule({
  declarations: [
    AtoListComponent,
    AtoMainComponent,
    AtoStatusComponent,
    AtoSummaryComponent,
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
