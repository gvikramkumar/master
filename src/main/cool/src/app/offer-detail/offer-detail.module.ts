import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule, AccordionModule } from 'primeng/primeng';

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
        FormsModule,
        CommonModule, 
        AccordionModule,
        SharedModule,
        DataTableModule,
    ],
    exports: [
        AvatarComponent,
        OfferDetailViewComponent,
        OfferCreateDetailComponent,
        StakeholderIdentificationComponent,
        NotificationOfferDetailPopupComponent
    ]
})
export class OfferDetailModule { }
