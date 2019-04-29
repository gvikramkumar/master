import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateOfferCoolComponent } from './create-offer-cool/create-offer-cool.component';
import { MmAssesmentComponent } from './monetization/mm-assesment/mm-assesment.component';
import { OfferDetailViewComponent } from './offer-detail/offer-detail-view/offer-detail-view.component';
import { ExitCriteriaValidationComponent } from '@app/review/exit-criteria-validation/exit-criteria-validation.component';
import { StakeholderFullComponent } from '@app/stakeholder/stakeholder-full/stakeholder-full.component';
import { StrategyReviewComponent } from '@app/review/strategy-review/strategy-review.component';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { OfferOverViewResolver } from './services/offer-overview-resolver.service';
import { OfferSolutioningComponent } from './solutioning/offer-solutioning/offer-solutioning.component';

import { MmInfoBarComponent } from './monetization/mm-info-bar/mm-info-bar.component';
import { OfferBasicInfoComponent } from './offer-basic-info/offer-basic-info.component';
import { MmMessageBarComponent } from './monetization/mm-message-bar/mm-message-bar.component';
import { OfferConstructComponent } from '@app/construct/offer-construct/offer-construct.component';
import { OasComponent } from './oas/oas.component';
import { DesignReviewComponent } from '@app/review/design-review/design-review.component';



const routes: Routes = [

  {
    path: 'access_token',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
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
    loadChildren: './modelling-design/modelling-design.module#ModellingDesignModule',
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