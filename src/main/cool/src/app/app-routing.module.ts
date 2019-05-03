import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OfferOverViewResolver } from './services/offer-overview-resolver.service';
import { DesignReviewComponent } from '@app/review/design-review/design-review.component';
import { StrategyReviewComponent } from '@app/review/strategy-review/strategy-review.component';
import { OfferDetailViewComponent } from './offer-detail/offer-detail-view/offer-detail-view.component';


const routes: Routes = [

  {
    path: 'access_token',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'action',
    loadChildren: './actions/actions.module#ActionsModule'
  },
  {
    path: 'accessManagement',
    loadChildren: './access-management/access-management.module#AccessManagementModule'
  },
  {
    path: 'offerDetailView/:offerId/:caseId',
    component: OfferDetailViewComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'coolOffer',
    loadChildren: './create-offer-cool/offer.module#OfferModule',
  },
  {
    path: 'coolOffer/:offerId/:caseId',
    loadChildren: './create-offer-cool/offer.module#OfferModule',
  },
  {
    path: 'mmassesment/:offerId/:caseId',
    loadChildren: './monetization/monetization.module#MonetizationModule',
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'stakeholderFull/:offerId/:caseId',
    loadChildren: './stakeholder/stakeholder.module#StakeholderModule',
  },
  {
    path: 'strategyReview/:offerId/:caseId',
    component: StrategyReviewComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'offerDimension/:offerId/:caseId',
    loadChildren: './monetization/monetization.module#MonetizationModule',
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'offerSolutioning/:offerId/:caseId',
    loadChildren: './solutioning/solutioning.module#SolutioningModule',
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'offerConstruct/:offerId/:caseId',
    loadChildren: './construct/construct.module#ConstructModule',
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'oas',
    loadChildren: './oas/oas.module#OasModule',
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'designReview/:offerId/:caseId',
    component: DesignReviewComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'offerSetup/:offerId/:caseId',
    loadChildren: './pirate-ship/pirate-ship.module#PirateShipModule',
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'offerSetup/:offerId/:caseId/:selectedAto',
    loadChildren: './pirate-ship/pirate-ship.module#PirateShipModule',
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'modelling-design/:offerId/:caseId/:selectedAto',
    loadChildren: './pirate-ship/modules/modelling-design/modelling-design.module#ModellingDesignModule',
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'item-creation/:offerId/:caseId/:selectedAto',
    loadChildren: './pirate-ship/modules/item-creation/item-creation.module#ItemCreationModule',
    resolve: { offerData: OfferOverViewResolver }
  }

];

@NgModule({
  exports: [RouterModule],
  imports: [
    [RouterModule.forRoot(routes, { useHash: true })]
  ],
  providers: [],
  declarations: []
})
export class AppRoutingModule { }