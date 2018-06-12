import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SubmeasureComponent} from './submeasure/submeasure/submeasure.component';
import {SubmeasureAddComponent} from './submeasure/submeasure-add/submeasure-add.component';
import {SubmeasureUploadComponent} from './submeasure/submeasure-upload/submeasure-upload.component';
import {RuleManagementComponent} from './rule-management/rule-management/rule-management.component';
import {RouterModule, Routes} from '@angular/router';
import {RuleManagementEditComponent} from './rule-management/rule-management-edit/rule-management-edit.component';
import {BusinessUploadComponent} from './business-upload/business-upload/business-upload.component';
import {MainComponent} from '../shared/components/main/main.component';
import {RuleManagementAssignComponent} from './rule-management/rule-management-assign/rule-management-assign.component';
import {AuthorizationGuard} from '../core/guards/authorization.guard';
import {ReportsComponent} from "./reports/reports/reports.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'submeasure',
        children: [
          {
            path: '', component: SubmeasureComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'pft-sm:access',
              hero: {
                title: 'Profitability: Sub-Measures',
                desc: 'Create and update sub-measures for profitability group'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure'}]
            }
          },
          {
            path: 'add', component: SubmeasureAddComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'pft-sm:manage',
              hero: {
                title: 'Profitability: Add a New Sub-Measure',
                desc: 'Add new sub-measure for Profitability group'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure', routerUrl: '/pft/submeasure'}, {label: 'Add New'}]
            }
          },
          {
            path: 'upload', component: SubmeasureUploadComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'pft-sm:manage',
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
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'pft-rm:access',
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
              authorization: 'pft-rm:manage',
              hero: {
                title: 'Profitability: Create New Rule',
                desc: 'Create a new rule for Profitability group'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management', routerUrl: '/pft/rule-management'}, {label: 'Create'}]
            }
          },
          {
            path: 'edit/:id', component: RuleManagementEditComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'pft-rm:manage',
              hero: {
                title: 'Profitability: Update Rule',
                desc: 'Update the selected rule'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management', routerUrl: '/pft/rule-management'}, {label: 'Update'}]
            }
          },
          {
            path: 'assign', component: RuleManagementAssignComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'pft-rm:manage',
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
        canActivate: [AuthorizationGuard],
        data: {
          authorization: 'pft-bu:access',
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
          authorization: 'pft-bu:access',
          hero: {
            title: 'Profitability: Reports',
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
export class ProfitabilityRoutingModule { }
