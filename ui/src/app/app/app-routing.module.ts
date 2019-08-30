import {ApplicationRef, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, RouterModule, Routes} from '@angular/router';
import {InitializationGuard} from '../core/guards/initialization.guard';
import {CoreModule} from '../core/core.module';
import {HomeComponent} from '../shared/components/home/index';
import {AppStore} from './app-store';
import {PageNotFoundComponent} from '../shared/components/page-not-found/page-not-found.component';
import {AuthorizationGuard} from '../core/guards/authorization.guard';
import {filter} from 'rxjs/operators';
import {UiUtil} from '../core/services/ui-util';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      authorization: 'profitability allocations:business admin, profitability allocations:super user, profitability allocations:business user, profitability allocations:end user,bookings misc allocations:business admin, bookings misc allocations:super user, bookings misc allocations:business user, bookings misc allocations:end user',
      breadcrumbs: [{label: 'Home'}]
    },
    canActivate: [InitializationGuard, AuthorizationGuard]
  },
  {
    path: 'admn',
    loadChildren: '../modules/admn/admn.module#AdmnModule',
    data: {
      authorization: 'it administrator'
    },
    canActivate: [InitializationGuard, AuthorizationGuard]
  },
  {
    path: 'prof',
    loadChildren: '../modules/prof/prof.module#ProfModule',
    data: {
      authorization: 'profitability allocations:business admin, profitability allocations:super user, profitability allocations:business user, profitability allocations:end user'
    },
    canActivate: [InitializationGuard, AuthorizationGuard]
  },
  {
    path: 'bkgm',
    loadChildren: '../modules/bkgm/bkgm.module#BkgmModule',
    data: {
      authorization: 'bookings misc allocations:business admin, bookings misc allocations:super user, bookings misc allocations:business user, bookings misc allocations:end user'
    },
    canActivate: [InitializationGuard, AuthorizationGuard]
  },
  {path: '**', component: PageNotFoundComponent}
];


@NgModule({
  imports: [
    CoreModule,
    RouterModule.forRoot(
      routes,
      {enableTracing: false} // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

  constructor(private store: AppStore, private router: Router, private appRef: ApplicationRef, private uiUtil: UiUtil) {
    this.init();
  }

  init() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.store.currentUrlPub(event.url);
        this.uiUtil.toastHide(); // toastPerm() will stay up on page changes, we'll pull it down then
        // console.log(event.url);
      });

  }
}
