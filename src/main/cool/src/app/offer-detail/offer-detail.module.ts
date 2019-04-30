import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { AvatarComponent } from './avatar/avatar.component';
import { OfferDetailViewComponent } from './offer-detail-view/offer-detail-view.component';
import { OfferCreateDetailComponent } from '@app/offer-detail/offer-create-detail/offer-create-detail.component';
import { NotificationOfferDetailPopupComponent } from './notification-offer-detail-popup/notification-offer-detail-popup.component';
import { StakeholderIdentificationComponent } from './stakeholder-identification/stakeholder-identification.component';

@NgModule({
    declarations: [
        AvatarComponent,
        OfferDetailViewComponent,
        OfferCreateDetailComponent,
        StakeholderIdentificationComponent,
        NotificationOfferDetailPopupComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        OfferDetailViewComponent,
        OfferCreateDetailComponent
    ]
})
export class OfferDetailModule { }
