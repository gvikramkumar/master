import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';

import * as _ from 'lodash';
import { CreateOfferCoolComponent } from './create-offer-cool.component';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { OFFER_ROUTES } from './offer.routes';

@NgModule({
    declarations: [
        CreateOfferCoolComponent
    ],
    imports: [
        SharedModule,
        MenuBarModule,
        DropdownModule,
        RouterModule.forChild(OFFER_ROUTES)
    ]
})
export class OfferModule { }
