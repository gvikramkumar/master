import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import * as _ from 'lodash';
import { OverlayPanelModule } from 'primeng/primeng';

import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { MenuBarPopupComponent } from './menu-bar-popup/menu-bar-popup.component';
import { MarkCompletePopupComponent } from './mark-complete-popup/mark-complete-popup.component';
import { SharedModule } from '@shared/shared.module';
import { OfferStatusComponent } from './offer-status/offer-status.component';
import { OfferPopupComponent } from './offer-popup/offer-popup.component';



@NgModule({
    declarations: [
        MenuBarComponent,
        OfferPopupComponent,
        OfferStatusComponent,
        MenuBarPopupComponent,
        MarkCompletePopupComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        SharedModule,
        OverlayPanelModule
    ], exports: [
        MenuBarComponent
    ]
})

export class MenuBarModule { }
