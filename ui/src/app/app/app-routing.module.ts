import {ApplicationRef, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NavigationEnd, Router, RouterModule, Routes} from "@angular/router";
import {InitializationGuard} from "../core/guards/initialization.guard";
import {CoreModule} from "../core/core.module";
import {HomeComponent} from '../shared/components/home/index';
import {AppStore} from './app-store';
import {PageNotFoundComponent} from '../shared/components/page-not-found/page-not-found.component';
import {AuthorizationGuard} from '../core/guards/authorization.guard';
import {filter} from 'rxjs/operators';

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
    path: 'prof',
    loadChildren: 'app/prof/prof.module#ProfModule',
    data: {
      authorization: 'prof:access'
    },
    canActivate: [InitializationGuard, AuthorizationGuard]
  },
  {
    path: 'prdt',
    loadChildren: 'app/prdt/prdt.module#PrdtModule',
    data: {
      authorization: 'prof:access'
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

  constructor(private store: AppStore, private router: Router, private appRef: ApplicationRef) {
    this.init();
  }

  init() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.store.currentUrlPub(event.url);
        // console.log(event.url);
      });

  }
}
