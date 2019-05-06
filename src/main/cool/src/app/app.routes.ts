
import { appRoutesNames } from './app.routes.names';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OfferOverViewResolver } from './services/offer-overview-resolver.service';
import { OfferDetailViewComponent } from './offer-detail/offer-detail-view/offer-detail-view.component';

export const APP_ROUTES = [
    {
        path: 'access_token',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: appRoutesNames.DASHBOARD,
        component: DashboardComponent
    },
    {
        path: appRoutesNames.ACTIONS,
        loadChildren: './actions/actions.module#ActionsModule'
    },
    {
        path: appRoutesNames.ACCESS_MANAGEMENT,
        loadChildren: './access-management/access-management.module#AccessManagementModule'
    },
    {
        path: appRoutesNames.OFFER_DETAIL_VIEW + '/:offerId/:caseId',
        component: OfferDetailViewComponent,
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: appRoutesNames.OFFER,
        loadChildren: './create-offer-cool/offer.module#OfferModule',
    },
    {
        path: appRoutesNames.OFFER + '/:offerId/:caseId',
        loadChildren: './create-offer-cool/offer.module#OfferModule',
    },
    {
        path: appRoutesNames.MONETIZATION + '/:offerId/:caseId',
        loadChildren: './monetization/monetization.module#MonetizationModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: appRoutesNames.STAKEHOLDER + '/:offerId/:caseId',
        loadChildren: './stakeholder/stakeholder.module#StakeholderModule',
    },
    {
        path: appRoutesNames.STRATEGY_REVIEW + '/:offerId/:caseId',
        loadChildren: './strategy-review/strategy-review.module#StrategyReviewModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: appRoutesNames.DIMENSIONS + '/:offerId/:caseId',
        loadChildren: './monetization/monetization.module#MonetizationModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: appRoutesNames.SOLUTIONING + '/:offerId/:caseId',
        loadChildren: './solutioning/solutioning.module#SolutioningModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: appRoutesNames.CONSTRUCT + '/:offerId/:caseId',
        loadChildren: './construct/construct.module#ConstructModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: appRoutesNames.OAS,
        loadChildren: './oas/oas.module#OasModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: appRoutesNames.DESIGN_REVIEW + '/:offerId/:caseId',
        loadChildren: './design-review/design-review.module#DesignReviewModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: appRoutesNames.PIRATE_SHIP + '/:offerId/:caseId',
        loadChildren: './pirate-ship/pirate-ship.module#PirateShipModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: appRoutesNames.PIRATE_SHIP + '/:offerId/:caseId/:selectedAto',
        loadChildren: './pirate-ship/pirate-ship.module#PirateShipModule',
        resolve: { offerData: OfferOverViewResolver }
    }
]
