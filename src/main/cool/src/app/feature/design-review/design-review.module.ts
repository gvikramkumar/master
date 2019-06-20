import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as _ from 'lodash';
import { SharedModule } from '@shared/shared.module';

import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';
import { RightPanelModule } from '@app/feature/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/feature/offer-detail/offer-detail.module';

import { DESIGN_REVIEW_ROUTES } from './design-review.routes';
import { DesignReviewComponent } from './design-review.component';
import { DesignReviewExitCriteriaComponent } from './components/design-review-exit-criteria/design-review-exit-criteria.component';
// tslint:disable-next-line: max-line-length


@NgModule({
    declarations: [
        DesignReviewComponent,
        DesignReviewExitCriteriaComponent
    ],
    imports: [
        SharedModule,
        TaskBarModule,
        MenuBarModule,
        RightPanelModule,
        OfferDetailModule,
        RouterModule.forChild(DESIGN_REVIEW_ROUTES)
    ]
})
export class DesignReviewModule { }
