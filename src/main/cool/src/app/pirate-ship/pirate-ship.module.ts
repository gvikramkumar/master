import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '../offer-detail/offer-detail.module';

import { ViewOfferComponent } from './view-offer/view-offer.component';
import { OfferSetupComponent } from './offer-setup/offer-setup.component';


const routes: Routes = [
  {
    path: '',
    component: OfferSetupComponent
  },
];

@NgModule({
  declarations: [
    OfferSetupComponent,
    ViewOfferComponent],
  imports: [
    FormsModule,
    CommonModule,
    MenuBarModule,
    TaskBarModule,
    RightPanelModule,
    OfferDetailModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    ViewOfferComponent
  ]
})
export class PirateShipModule { }
