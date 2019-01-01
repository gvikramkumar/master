import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateOfferCoolComponent } from './create-offer-cool/create-offer-cool.component';
import { MmAssesmentComponent } from './mm-assesment/mm-assesment.component';
import { CreateNewOfferComponent } from './create-new-offer/create-new-offer.component';
import { OfferDetailViewComponent } from './offer-detail-view/offer-detail-view.component';
import {ExitCriteriaValidationComponent} from './exit-criteria-validation/exit-criteria-validation.component';
import {StakeholderFullComponent} from './stakeholder-full/stakeholder-full.component';
import {MenuBarComponent} from './menu-bar/menu-bar.component';
import { StrategyReviewComponent } from './strategy-review/strategy-review.component';

import { CreateNewActionComponent } from './create-new-action/create-new-action.component';
import { ActionsComponent } from './actions/actions.component';
import { AccessManagementComponent } from './access-management/access-management.component';
import { BupmGuard } from './auth/gaurds/bupm-guard';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { OfferOverViewResolver } from './services/offer-overview-resolver.service';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch : 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  } ,
  {
    path: 'coolOffer',
    component: CreateOfferCoolComponent,
    canActivate: [BupmGuard]
  },
  {
    path: 'coolOffer/:id',
    component: CreateOfferCoolComponent
  },
  {
    path: 'mmassesment/:id/:id2',
    component: MmAssesmentComponent,
    resolve:{ offerData: OfferOverViewResolver }
  },
  {
    path: 'createNewOffer',
    component: CreateNewOfferComponent
  },
  {
    path: 'createNewAction',
    component: CreateNewActionComponent
  },
  {
    path: 'action',
    component: ActionsComponent
  },
  {
    path: 'offerDetailView/:id/:id2',
    component: OfferDetailViewComponent,
    resolve:{ offerData: OfferOverViewResolver }
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
    component: MenuBarComponent},
    {
    path: 'strategyReview/:id',
    component: StrategyReviewComponent,
    resolve:{ offerData: OfferOverViewResolver }
  },
  {
    path: 'accessManagement',
    component: AccessManagementComponent
  },
  {
    path: 'auth-error',
    component: AuthErrorComponent
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

// @NgModule({
//   exports: [RouterModule],
//   imports: [
//     CommonModule,
//     [RouterModule.forRoot(routes,{ preloadingStrategy: PreloadAllModules })]
//   ],
//   declarations: []
// })
// export class AppRoutingModule { }
