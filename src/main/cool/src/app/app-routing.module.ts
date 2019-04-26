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
import { OfferSetupComponent } from './offer-setup/offer-setup.component';

import { MmInfoBarComponent } from './monetization/mm-info-bar/mm-info-bar.component';
import { OfferBasicInfoComponent } from './offer-basic-info/offer-basic-info.component';
import { MmMessageBarComponent } from './monetization/mm-message-bar/mm-message-bar.component';
import { OfferConstructComponent } from '@app/construct/offer-construct/offer-construct.component';
import { OasComponent } from './oas/oas.component';
import { DesignReviewComponent } from '@app/review/design-review/design-review.component';



const routes: Routes = [

  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'coolOffer',
    component: CreateOfferCoolComponent
  },
  {
    path: 'coolOffer/:offerId/:caseId',
    component: CreateOfferCoolComponent
  },
  {
    path: 'mmassesment/:offerId/:caseId',
    component: MmAssesmentComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'offerDimension/:offerId/:caseId',
    component: MmAssesmentComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'action',
    loadChildren: './actions/actions.module#ActionsModule'
  },
  {
    path: 'offerDetailView/:offerId/:caseId',
    component: OfferDetailViewComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'exitCriteriaValidation/:id',
    component: ExitCriteriaValidationComponent
  },
  {
    path: 'stakeholderFull/:offerId/:caseId',
    component: StakeholderFullComponent
  },
  {
    path: 'strategyReview/:offerId/:caseId',
    component: StrategyReviewComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'accessManagement',
    loadChildren: './access-management/access-management.module#AccessManagementModule'
  },
  {
    path: 'auth-error',
    component: AuthErrorComponent
  },
  {
    path: 'offerSolutioning/:offerId/:caseId',
    component: OfferSolutioningComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
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
    path: 'mm-infobar',
    component: MmInfoBarComponent
  },
  {
    path: 'offer-basic',
    component: OfferBasicInfoComponent
  },
  {
    path: 'mm-message',
    component: MmMessageBarComponent
  },
  {
    path: 'offerConstruct/:offerId/:caseId',
    component: OfferConstructComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'oas',
    component: OasComponent
  },
  {
    path: 'offerSolutioning/:offerId/:caseId',
    component: OfferSolutioningComponent
  }, {
    path: 'offerConstruct/:offerId/:caseId',
    component: OfferConstructComponent
  },
  {
    path: 'designReview/:offerId/:caseId',
    component: DesignReviewComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'offer-setup/:offerId/:caseId/:selectedAto',
    component: OfferSetupComponent,
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