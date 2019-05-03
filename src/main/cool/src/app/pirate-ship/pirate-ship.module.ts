import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '../offer-detail/offer-detail.module';

import { ViewOfferComponent } from './view-offer/view-offer.component';
import {pirateshipComponent} from '@app/pirate-ship/pirate-ship.component';
import {ATOSummaryComponent} from '@app/pirate-ship/components/atosummary/atosummary.component';
import {OfferSetupComponent} from '@app/pirate-ship/offer-setup.component';


const routes: Routes = [
  {
    path: '',
    component: pirateshipComponent,
    pathMatch:'prefix',
    children: [
      {
        path: '',
        pathMatch:'full',
        redirectTo:'offerset'
      },
      {
        path:'offerset',
        component: OfferSetupComponent
      },

      {path: 'atosummary/:offerId/:selectedAto',
        component: ATOSummaryComponent}
    ]
  }
];

@NgModule({
  declarations: [
    pirateshipComponent,
    OfferSetupComponent,
    ViewOfferComponent,
    ATOSummaryComponent],
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
