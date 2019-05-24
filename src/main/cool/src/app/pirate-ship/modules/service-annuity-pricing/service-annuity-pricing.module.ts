import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';

import { RouterModule } from '@angular/router';
import { SERVICE_ANNUITY_PRICING_ROUTES } from './service-annuity-pricing.routes';

import { ServiceAnnuityPricingComponent } from './service-annuity-pricing.component';
import {SapAtoSummaryComponent} from '@pirateShip/modules/service-annuity-pricing/component/sap-ato-summary/sap-ato-summary.component';

@NgModule({
  declarations: [
    ServiceAnnuityPricingComponent,
    SapAtoSummaryComponent
  ],
  imports: [
    SharedModule,
    TaskBarModule,
    MenuBarModule,
    RightPanelModule,
    OfferDetailModule,
    RouterModule.forChild(SERVICE_ANNUITY_PRICING_ROUTES)
  ],
  exports: [
    RouterModule,
    SapAtoSummaryComponent
  ]
})
export class ServiceAnnuityPricingModule { }
