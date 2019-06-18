
import { appRoutesNames } from './app.routes.names';
import { DashboardComponent } from '@app//feature/dashboard/dashboard.component';
import { OfferOverViewResolver } from './services/offer-overview-resolver.service';
import { OfferDetailViewComponent } from '@app/feature/offer-detail/offer-detail-view/offer-detail-view.component';
import { COOLguardService } from './core/guards/coolguard.service';
import { ErrorpageComponent } from '@shared/components/errorpage/errorpage.component';
import { CanActivate } from '@angular/router';

export const APP_ROUTES = [
    {
        path: 'access_token',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: appRoutesNames.DASHBOARD,
        component: DashboardComponent,
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.ERROR_PAGE,
        component: ErrorpageComponent
    },
    {
        path: appRoutesNames.ACTIONS,
        loadChildren: './feature/actions/actions.module#ActionsModule',
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.ACCESS_MANAGEMENT,
        loadChildren: './feature/access-management/access-management.module#AccessManagementModule',
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.OFFER_DETAIL_VIEW + '/:offerId/:caseId',
        component: OfferDetailViewComponent,
        resolve: { offerData: OfferOverViewResolver },
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.OFFER,
        loadChildren: './feature/create-offer-cool/offer.module#OfferModule',
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.OFFER + '/:offerId/:caseId',
        loadChildren: './feature/create-offer-cool/offer.module#OfferModule',
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.MONETIZATION + '/:offerId/:caseId',
        loadChildren: './feature/monetization/monetization.module#MonetizationModule',
        resolve: { offerData: OfferOverViewResolver },
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.STAKEHOLDER + '/:offerId/:caseId',
        loadChildren: './feature/stakeholder/stakeholder.module#StakeholderModule',
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.STRATEGY_REVIEW + '/:offerId/:caseId',
        loadChildren: './feature/strategy-review/strategy-review.module#StrategyReviewModule',
        resolve: { offerData: OfferOverViewResolver },
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.DIMENSIONS + '/:offerId/:caseId',
        loadChildren: './feature/monetization/monetization.module#MonetizationModule',
        resolve: { offerData: OfferOverViewResolver },
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.SOLUTIONING + '/:offerId/:caseId',
        loadChildren: './feature/solutioning/solutioning.module#SolutioningModule',
        resolve: { offerData: OfferOverViewResolver },
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.CONSTRUCT + '/:offerId/:caseId',
        loadChildren: './feature/construct/construct.module#ConstructModule',
        resolve: { offerData: OfferOverViewResolver },
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.OAS,
        loadChildren: './feature/oas/oas.module#OasModule',
        resolve: { offerData: OfferOverViewResolver },
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.DESIGN_REVIEW + '/:offerId/:caseId',
        loadChildren: './feature/design-review/design-review.module#DesignReviewModule',
        resolve: { offerData: OfferOverViewResolver },
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.PIRATE_SHIP + '/:offerId/:caseId',
        loadChildren: './feature/pirate-ship/pirate-ship.module#PirateShipModule',
        resolve: { offerData: OfferOverViewResolver },
        canActivate: [COOLguardService]
    },
    {
        path: appRoutesNames.PIRATE_SHIP + '/:offerId/:caseId/:selectedAto',
        loadChildren: './feature/pirate-ship/pirate-ship.module#PirateShipModule',
        resolve: { offerData: OfferOverViewResolver },
        canActivate: [COOLguardService]
    }
]
