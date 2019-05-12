import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '../offer-detail/offer-detail.module';

import { PIRATE_SHIP_ROUTES } from './pirate-ship.routes';
import { OfferSetupComponent } from './offer-setup.component';

@NgModule({
  declarations: [
    OfferSetupComponent
  ],
  imports: [
    SharedModule,
    MenuBarModule,
    TaskBarModule,
    RightPanelModule,
    OfferDetailModule,
    RouterModule.forChild(PIRATE_SHIP_ROUTES),
  ],
  exports: [
    RouterModule
  ]
})
export class PirateShipModule { }
