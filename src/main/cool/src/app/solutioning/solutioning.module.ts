import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { NgModule } from '@angular/core';

import * as _ from 'lodash';
import { MenuBarModule } from '../menu/menu-bar.module';
import { RightPanelModule } from '../right-panel/right-panel.module';
import { OfferSolutioningComponent } from './offer-solutioning/offer-solutioning.component';
import { OffersolutioningCardOneComponent } from './offer-solutioning-card-one/offer-solutioning-card-one.component';
import { OfferSolutionQuestionComponent } from './offer-solution-question/offer-solution-question.component';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { OfferDetailModule } from '../offer-detail/offer-detail.module';


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
        FormsModule,
        CommonModule,
        TaskBarModule,
        MenuBarModule,
        RightPanelModule,
        OfferDetailModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        OfferSolutioningComponent,
        OfferSolutionQuestionComponent,
        OffersolutioningCardOneComponent
    ]
})
export class SolutioningModule { }
