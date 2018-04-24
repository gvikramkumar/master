import {ApplicationRef, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router, RouterModule, Routes} from "@angular/router";
import {InitializationGuard} from "./guards/initialization.guard";
import {StoreModule} from "../store/store.module";
import {CoreModule} from "../core/core.module";
import {HomeComponent} from '../common/home';
import {SubmeasureComponent} from '../profitability/submeasure/submeasure/submeasure.component';
import {SubmeasureUploadComponent} from '../profitability/submeasure/submeasure-upload/submeasure-upload.component';
import {SubmeasureAddComponent} from '../profitability/submeasure/submeasure-add/submeasure-add.component';
import {RuleManagementComponent} from '../profitability/rule-management/rule-management/rule-management.component';
import {RuleManagementEditComponent} from '../profitability/rule-management/rule-management-edit/rule-management-edit.component';
import {RuleManagementAssignComponent} from '../profitability/rule-management/rule-management-assign/rule-management-assign.component';
import {BusinessUploadComponent} from '../profitability/business-upload/business-upload/business-upload.component';
import {MainComponent} from '../common/main/main.component';
import {Store} from '../store/store';
import * as _ from 'lodash';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [InitializationGuard]
  },
  {
    path: 'pft',
    component: MainComponent,
    canActivate: [InitializationGuard],
    children: [
      {
        path: 'submeasure',
        children: [
          {path: '', component: SubmeasureComponent},
          {path: 'add', component: SubmeasureAddComponent},
          {path: 'upload', component: SubmeasureUploadComponent},
        ]
      },
      {
        path: 'rule-management',
        children: [
          {path: '', component: RuleManagementComponent},
          {path: 'add', component: RuleManagementEditComponent},
          {path: 'edit/:id', component: RuleManagementEditComponent},
          {path: 'assign', component: RuleManagementAssignComponent},
        ],
      },
      {path: 'business-upload', component: BusinessUploadComponent},
    ]
  },
  {path: '**', redirectTo: '/'}
];

const routeData = [
  {
    url: /pft\/submeasure/,
    hero: {title: 'Profitability: Sub-Measures', desc: 'Create and update sub-measures for profitability group.'},
    breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Profitability'}, {label: 'Sub-Measure'}]
  }
]

/*

data: {
  hero: {title: 'Profitability: Add a New Sub-Measure', desc: 'Add new sub-measure for Profitability group'},
  breadcrumbs: [
    {label: 'Home', routerUrl: '/'},
    {label: 'Profitability'},
    {label: 'Sub-Measure'},
  ]
}
*/


@NgModule({
  imports: [
    CommonModule,
    StoreModule,
    CoreModule,
    RouterModule.forRoot(
      routes,
      {enableTracing: false} // <-- debugging purposes only
    )
  ],
  exports: [RouterModule],
  providers: [InitializationGuard]
})
export class RoutingModule {

  constructor(private store: Store, private router: Router, private appRef: ApplicationRef) {
    this.init();
  }

  init() {
    this.router.events.filter(e => e instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        const arr = routeData.filter(x => x.url.test(event.url));
        if (arr.length !== 1) {
          throw new Error('No routeData for url: ' + event.url);
        }
        this.appRef.tick();
        this.store.routeDataPub(arr[0]);
      });

  }
}
