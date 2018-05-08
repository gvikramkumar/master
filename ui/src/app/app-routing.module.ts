import {ApplicationRef, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NavigationEnd, Router, RouterModule, Routes} from "@angular/router";
import {InitializationGuard} from "./core/guards/initialization.guard";
import {CoreModule} from "./core/core.module";
import {HomeComponent} from './shared/components/home/index';
import {Store} from './store/store';
import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';
import {AuthorizationGuard} from './core/guards/authorization.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      authorization: 'dfa:access'
    },
    canActivate: [InitializationGuard, AuthorizationGuard]
  },
  {
    path: 'pft',
    loadChildren: 'app/profitability/profitability.module#ProfitabilityModule',
    data: {
      authorization: 'pft:access'
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

  constructor(private store: Store, private router: Router, private appRef: ApplicationRef) {
    this.init();
  }

  init() {
    this.router.events.filter(e => e instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        this.store.currentUrlPub(event.url);
      });

  }
}
