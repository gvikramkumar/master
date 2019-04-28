import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferSetupComponent } from './offer-setup/offer-setup.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { SharedModule } from 'primeng/primeng';
import { ViewOfferComponent } from './view-offer/view-offer.component';
import { OfferDetailModule } from '../offer-detail/offer-detail.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';

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
  ]
})
export class PirateShipModule { }
