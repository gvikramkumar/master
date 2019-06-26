import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';
import { RightPanelModule } from '@app/feature/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/feature/offer-detail/offer-detail.module';

import { SalesCompensationComponent } from './sales-compensation.component';

import * as _ from 'lodash';
import { SALES_COMPENSATION_ROUTES } from './sales-compensation.routes';
import { TreeTableModule, AutoCompleteModule, ConfirmDialogModule, OverlayPanelModule } from 'primeng/primeng';
import {CheckboxModule} from 'primeng/checkbox';


@NgModule({

  declarations: [
    SalesCompensationComponent,
  ],
  imports: [
    SharedModule,
    TaskBarModule,
    MenuBarModule,
    RightPanelModule,
    OfferDetailModule,
    TreeTableModule,
    ConfirmDialogModule,
    OverlayPanelModule,
    CheckboxModule,
    RouterModule.forChild(SALES_COMPENSATION_ROUTES)
  ],
  exports: [
    RouterModule
  ]

})
export class SalesCompensationModule { }
