import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import * as _ from 'lodash';
import { OverlayPanelModule } from 'primeng/primeng';

import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { MenuBarPopupComponent } from './menu-bar-popup/menu-bar-popup.component';
import { OfferDetailPopUpComponent } from './offer-detail-pop-up/offer-detail-pop-up.component';
import { MarkCompletePopupComponent } from './mark-complete-popup/mark-complete-popup.component';



@NgModule({
    declarations: [
        MenuBarComponent,
        MenuBarPopupComponent,
        OfferDetailPopUpComponent,
        MarkCompletePopupComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        OverlayPanelModule
    ], exports: [
        MenuBarComponent,
        MenuBarPopupComponent,
        OfferDetailPopUpComponent
    ]
})

export class MenuBarModule { }
