import { NgModule } from '@angular/core';
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
    SharedModule,
    MenuBarModule,
    TaskBarModule,
    RightPanelModule,
    OfferDetailModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    ViewOfferComponent
  ]
})
export class PirateShipModule { }
