import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as _ from 'lodash';
import { SharedModule } from '@shared/shared.module';

import { MenuBarModule } from '@app/menu/menu-bar.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';

import { STRATEGY_REVIEW_ROUTES } from './stategy-review.routes';
import { StrategyReviewComponent } from './strategy-review.component';
// tslint:disable-next-line: max-line-length
import { ExitCriteriaValidationComponent } from '@app/strategy-review/components/exit-criteria-validation/exit-criteria-validation.component';

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
