import {NgModule} from '@angular/core';
import {SubmeasureComponent} from '../dfa-common/submeasure/submeasure/submeasure.component';
import {SubmeasureEditComponent} from '../dfa-common/submeasure/submeasure-edit/submeasure-edit.component';
import {RuleManagementComponent} from '../dfa-common/rule-management/rule-management/rule-management.component';
import {RouterModule, Routes} from '@angular/router';
import {RuleManagementEditComponent} from '../dfa-common/rule-management/rule-management-edit/rule-management-edit.component';
import {BusinessUploadComponent} from '../dfa-common/business-upload/business-upload/business-upload.component';
import {MainComponent} from '../shared/components/main/main.component';
import {AuthorizationGuard} from '../core/guards/authorization.guard';
import {ReportsComponent} from '../dfa-common/reports/reports/reports.component';
import {Modules} from '../dfa-common/models/enums';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {module: Modules.prof},
    children: [
      {
        path: 'submeasure',
        children: [
          {
            path: '', component: SubmeasureComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'prof-sm:access',
              hero: {
                title: 'Profitability: Sub-Measures',
                desc: 'Create and update sub-measures'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure'}]
            }
          },
          {
            path: 'add', component: SubmeasureEditComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'prof-sm:manage',
              hero: {
                title: 'Profitability: Add a New Sub-Measure',
                desc: 'Add new sub-measure'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure', routerUrl: '/prof/submeasure'}, {label: 'Add New'}]
            }
          },
          {
            path: 'edit/:id', component: SubmeasureEditComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'prof-sm:manage',
              hero: {
                title: 'Profitability: Update Sub-Measure',
                desc: 'Update the selected sub-measure'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure', routerUrl: '/prof/submeasure'}, {label: 'Update'}]
            }
          }
        ]
      },
      {
        path: 'rule-management',
        children: [
          {
            path: '', component: RuleManagementComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'prof-rm:access',
              hero: {
                title: 'Profitability: Rule Management',
                desc: 'Create and update rules for Profitability group'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management'}]
            }
          },
          {
            path: 'add', component: RuleManagementEditComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'prof-rm:manage',
              hero: {
                title: 'Profitability: Create New Rule',
                desc: 'Create a new rule'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management', routerUrl: '/prof/rule-management'}, {label: 'Create'}]
            }
          },
          {
            path: 'edit/:id', component: RuleManagementEditComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'prof-rm:manage',
              hero: {
                title: 'Profitability: Update Rule',
                desc: 'Update the selected rule'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management', routerUrl: '/prof/rule-management'}, {label: 'Update'}]
            }
          }
        ],
      },
      {
        path: 'business-upload', component: BusinessUploadComponent,
        canActivate: [AuthorizationGuard],
        data: {
          authorization: 'prof-bu:access',
          hero: {
            title: 'Profitability: Business Uploads',
            desc: 'Perform bulk uploads'
          },
          breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Business Upload'}]
        }
      },
      {
        path: 'reports', component: ReportsComponent,
        canActivate: [AuthorizationGuard],
        data: {
          authorization: 'prof-bu:access',
          hero: {
            title: ': Reports',
            desc: 'Allow users to download a report'
          },
          breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Report'}]
        },
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class ProfRoutingModule {

}
