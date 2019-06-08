import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as _ from 'lodash';
import { SharedModule } from '@shared/shared.module';

import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';
import { RightPanelModule } from '@app/feature/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/feature/offer-detail/offer-detail.module';

import { STRATEGY_REVIEW_ROUTES } from './stategy-review.routes';
import { StrategyReviewComponent } from './strategy-review.component';
import { ExitCriteriaValidationComponent } from './components/exit-criteria-validation/exit-criteria-validation.component';
// tslint:disable-next-line: max-line-length

@NgModule({
    declarations: [
        StrategyReviewComponent,
        ExitCriteriaValidationComponent
    ],
    imports: [
        SharedModule,
        TaskBarModule,
        MenuBarModule,
        RightPanelModule,
        OfferDetailModule,
        RouterModule.forChild(STRATEGY_REVIEW_ROUTES)
    ]
})
export class StrategyReviewModule { }
