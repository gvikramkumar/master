import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';
import { RightPanelModule } from '@app/feature/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/feature/offer-detail/offer-detail.module';

import { PIRATE_SHIP_ROUTES } from './pirate-ship.routes';
import { OfferSetupComponent } from './offer-setup.component';

/* NgRx */
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './state/pirate-ship.reducer';
import { PirateShipEffects } from './state/pirate-ship.effects';

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
    StoreModule.forFeature('pirateShip', reducer),
    EffectsModule.forFeature(
      [ PirateShipEffects ]
    ),
  ],
  exports: [
    RouterModule
  ]
})
export class PirateShipModule { }
