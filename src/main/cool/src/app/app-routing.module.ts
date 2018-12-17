import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateOfferCoolComponent } from './create-offer-cool/create-offer-cool.component';
import { MmAssesmentComponent } from './mm-assesment/mm-assesment.component';
import { CreateNewOfferComponent } from './create-new-offer/create-new-offer.component';
import { OfferDetailViewComponent } from './offer-detail-view/offer-detail-view.component';
import { StrategyReviewComponent } from './strategy-review/strategy-review.component';
import {ExitCriteriaValidationComponent} from './exit-criteria-validation/exit-criteria-validation.component';
import { CreateNewActionComponent } from './create-new-action/create-new-action.component';
import { ActionsComponent } from './actions/actions.component';
import { AccessManagementComponent } from './access-management/access-management.component';


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
    component: CreateOfferCoolComponent
  },
  {
    path: 'coolOffer/:id',
    component: CreateOfferCoolComponent
  },
  {
    path: 'mmassesment/:id',
    component: MmAssesmentComponent
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
    path: 'offerDetailView/:id',
    component: OfferDetailViewComponent
  },
  {
    path: 'exitCriteriaValidation',
    component: ExitCriteriaValidationComponent
  },
  {
    path: 'strategyReview/:id',
    component: StrategyReviewComponent
  },
  {
    path: 'accessManagement',
    component: AccessManagementComponent
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
