import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as _ from 'lodash';
import { SharedModule } from '@shared/shared.module';

import { MenuBarModule } from '@app/menu/menu-bar.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';

import { DESIGN_REVIEW_ROUTES } from './design-review.routes';
import { DesignReviewComponent } from './design-review.component';
// tslint:disable-next-line: max-line-length
import { DesignReviewExitCriteriaComponent } from '@app/design-review/components/design-review-exit-criteria/design-review-exit-criteria.component';


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
