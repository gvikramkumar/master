import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as _ from 'lodash';
import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '../menu/menu-bar.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { RightPanelModule } from '../right-panel/right-panel.module';
import { OfferDetailModule } from '../offer-detail/offer-detail.module';

import { OfferSolutioningComponent } from './offer-solutioning/offer-solutioning.component';
import { OffersolutioningCardOneComponent } from './offer-solutioning-card-one/offer-solutioning-card-one.component';
import { OfferSolutionQuestionComponent } from './offer-solution-question/offer-solution-question.component';




const routes: Routes = [
    {
        path: '',
        component: OfferSolutioningComponent
    },
];

@NgModule({
    declarations: [
        OfferSolutioningComponent,
        OfferSolutionQuestionComponent,
        OffersolutioningCardOneComponent
    ],
    imports: [
        SharedModule,
        TaskBarModule,
        MenuBarModule,
        RightPanelModule,
        OfferDetailModule,
        RouterModule.forChild(routes)
    ]
})
export class SolutioningModule { }
