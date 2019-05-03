
import { reviewRoutesNames } from './review.routes.names';

import { StrategyReviewComponent } from './strategy-review/strategy-review.component';
import { DesignReviewComponent } from './design-review/design-review.component';

export const REVIEW_ROUTES = [
    {
        path: reviewRoutesNames.STRATEGY_REVIEW,
        component: StrategyReviewComponent
    },
    {
        path: reviewRoutesNames.DESIGN_REVIEW,
        component: DesignReviewComponent
    }
]