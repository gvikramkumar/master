import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

import * as _ from 'lodash';
import { TaskBarModule } from '../taskbar/task-bar.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';
import { MmInfoBarComponent } from './mm-info-bar/mm-info-bar.component';
import { MmAssesmentComponent } from './mm-assesment/mm-assesment.component';
import { MmMessageBarComponent } from './mm-message-bar/mm-message-bar.component';

const routes: Routes = [
    {
        path: '',
        component: MmAssesmentComponent
    },
];

@NgModule({
    declarations: [
        MmInfoBarComponent,
        MmAssesmentComponent,
        MmMessageBarComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        SharedModule,
        TaskBarModule,
        MenuBarModule,
        RightPanelModule,
        OfferDetailModule,
        RouterModule.forChild(routes)
    ]
})
export class MonetizationModule { }
