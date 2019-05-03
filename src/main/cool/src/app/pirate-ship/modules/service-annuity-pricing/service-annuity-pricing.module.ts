import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceAnnuityPricingComponent } from './service-annuity-pricing.component';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { SharedModule } from 'primeng/primeng';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';
import { RouterModule } from '@angular/router';
import { SERVICE_ANNUITY_PRICING_ROUTES } from './service-annuity-pricing.routes';

@NgModule({
  declarations: [ServiceAnnuityPricingComponent],
  imports: [
    SharedModule,
    TaskBarModule,
    MenuBarModule,
    RightPanelModule,
    OfferDetailModule,
    RouterModule.forChild(SERVICE_ANNUITY_PRICING_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class ServiceAnnuityPricingModule { }
