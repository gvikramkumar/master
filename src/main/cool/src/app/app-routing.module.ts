import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateOfferCoolComponent } from './create-offer-cool/create-offer-cool.component';
import { MmAssesmentComponent } from './monetization/mm-assesment/mm-assesment.component';
import { OfferDetailViewComponent } from './offer-detail/offer-detail-view/offer-detail-view.component';
import { ExitCriteriaValidationComponent } from '@app/review/exit-criteria-validation/exit-criteria-validation.component';
import { StakeholderFullComponent } from '@app/stakeholder/stakeholder-full/stakeholder-full.component';
import { MenuBarComponent } from './menu/menu-bar/menu-bar.component';
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
import { OfferDimensionComponent } from './dimensions/offer-dimension/offer-dimension.component';
import { DesignReviewComponent } from '@app/review/design-review/design-review.component';
import { AtoMainComponent } from './modelling-design/ato-main/ato-main.component';


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
    path: 'coolOffer/:id/:id2',
    component: CreateOfferCoolComponent
  },
  {
    path: 'mmassesment/:id/:id2',
    component: MmAssesmentComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'offerDimension/:id/:id2',
    component: MmAssesmentComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'action',
    loadChildren: './actions/actions.module#ActionsModule'
  },
  {
    path: 'offerDetailView/:id/:id2',
    component: OfferDetailViewComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'exitCriteriaValidation/:id',
    component: ExitCriteriaValidationComponent
  },
  {
    path: 'stakeholderFull/:id/:id2',
    component: StakeholderFullComponent
  },
  {
    path: 'menu',
    component: MenuBarComponent
  },
  {
    path: 'strategyReview/:id/:id2',
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
    path: 'offerSolutioning/:id/:id2',
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
    path: 'offerConstruct/:id/:id2',
    component: OfferConstructComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'oas',
    component: OasComponent
  },
  {
    path: 'offerDimension/:id/:id2',
    component: OfferDimensionComponent
  }, {
    path: 'offerSolutioning/:id/:id2',
    component: OfferSolutioningComponent
  }, {
    path: 'offerConstruct/:id/:id2',
    component: OfferConstructComponent
  },
  {
    path: 'designReview/:id/:id2',
    component: DesignReviewComponent,
    resolve: { offerData: OfferOverViewResolver }
  },
  {
    path: 'offerSetup',
    component: OfferSetupComponent
  },
  {
    path: 'modelling-design',
    loadChildren: './modelling-design/modelling-design.module#ModellingDesignModule'
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