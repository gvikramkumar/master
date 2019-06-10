import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

import * as _ from 'lodash';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';
import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { RightPanelModule } from '@app/feature/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/feature/offer-detail/offer-detail.module';
import { MmInfoBarComponent } from './mm-info-bar/mm-info-bar.component';
import { MmAssesmentComponent } from './mm-assesment/mm-assesment.component';
import { MmMessageBarComponent } from './mm-message-bar/mm-message-bar.component';

import { MONETIZATION_ROUTES } from './monetization.routes';


@NgModule({
    declarations: [
        MmInfoBarComponent,
        MmAssesmentComponent,
        MmMessageBarComponent
    ],
    imports: [
        SharedModule,
        TaskBarModule,
        MenuBarModule,
        RightPanelModule,
        OfferDetailModule,
        RouterModule.forChild(MONETIZATION_ROUTES)
    ]
})
export class MonetizationModule { }
