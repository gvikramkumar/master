import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfferCreateDetailComponent } from '@app/offer-detail/offer-create-detail/offer-create-detail.component';
import { OfferDetailViewComponent } from './offer-detail-view/offer-detail-view.component';
import { NotificationOfferDetailPopupComponent } from './notification-offer-detail-popup/notification-offer-detail-popup.component';
import { SharedModule, DataTableModule, AccordionModule } from 'primeng/primeng';
import { StakeholderIdentificationComponent } from './stakeholder-identification/stakeholder-identification.component';
import { AvatarComponent } from './avatar/avatar.component';


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
