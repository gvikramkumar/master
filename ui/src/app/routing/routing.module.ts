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
          {
            path: '', component: SubmeasureComponent,
            data: {
              hero: {
                title: 'Profitability: Sub-Measures',
                desc: 'Create and update sub-measures for profitability group'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure'}]
            }

          },
          {
            path: 'add', component: SubmeasureAddComponent,
            data: {
              hero: {
                title: 'Profitability: Add a New Sub-Measure',
                desc: 'Add new sub-measure for Profitability group'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure', routerUrl: '/pft/submeasure'}, {label: 'Add New'}]
            }
          },
          {
            path: 'upload', component: SubmeasureUploadComponent,
            data: {
              hero: {
                title: 'Profitability: Upload a New Sub-Measure',
                desc: 'Upload new sub-measure for Profitability group'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure', routerUrl: '/pft/submeasure'}, {label: 'Upload'}]
            }
          },
        ]
      },
      {
        path: 'rule-management',
        children: [
          {
            path: '', component: RuleManagementComponent,
            data: {
              hero: {
                title: 'Profitability: Rule Management',
                desc: 'Create and update rules for Profitability group'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management'}]
            }
          },
          {
            path: 'add', component: RuleManagementEditComponent,
            data: {
              hero: {
                title: 'Profitability: Create New Rule',
                desc: 'Create a new rule for Profitability group'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management', routerUrl: '/pft/rule-management'}, {label: 'Create'}]
            }
          },
          {
            path: 'edit/:id', component: RuleManagementEditComponent,
            data: {
              hero: {
                title: 'Profitability: Update Rule',
                desc: 'Update the selected rule'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management', routerUrl: '/pft/rule-management'}, {label: 'Update'}]
            }
          },
          {
            path: 'assign', component: RuleManagementAssignComponent,
            data: {
              hero: {
                title: 'Profitability: Assign Rule',
                desc: 'Assign rule for Profitability group'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management', routerUrl: '/pft/rule-management'}, {label: 'Assign'}]
            }
          },
        ],
      },
      {
        path: 'business-upload', component: BusinessUploadComponent,
        data: {
          hero: {
            title: 'Profitability: Business Uploads',
            desc: 'Perform bulk uploads'
          },
          breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Business Upload'}]
        }
      },
    ]
  },
  {path: '**', redirectTo: '/'}
];

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
        this.store.currentUrlPub(event.url);
      });

  }
}
