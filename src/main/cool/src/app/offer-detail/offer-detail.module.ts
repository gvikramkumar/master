import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { AvatarComponent } from './avatar/avatar.component';
import { OfferDetailViewComponent } from './offer-detail-view/offer-detail-view.component';
import { StakeholderIdentificationComponent } from './stakeholder-identification/stakeholder-identification.component';
import { NotificationOfferDetailPopupComponent } from './notification-offer-detail-popup/notification-offer-detail-popup.component';

import { RouterModule } from '@angular/router';
import { OFFER_DETAIL_VIEW_ROUTES } from './offer-detail-view.routes';

@NgModule({
    declarations: [
        AvatarComponent,
        OfferDetailViewComponent,
        StakeholderIdentificationComponent,
        NotificationOfferDetailPopupComponent
    ],
    imports: [
        SharedModule,
        // RouterModule.forChild(OFFER_DETAIL_VIEW_ROUTES)
    ],
    exports: [
        OfferDetailViewComponent
    ]
})
export class OfferDetailModule { }
