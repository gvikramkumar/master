import {NgModule} from '@angular/core';
import {SubmeasureComponent} from '../_common/submeasure/submeasure/submeasure.component';
import {SubmeasureEditComponent} from '../_common/submeasure/submeasure-edit/submeasure-edit.component';
import {RuleManagementComponent} from '../_common/rule-management/rule-management/rule-management.component';
import {RouterModule, Routes} from '@angular/router';
import {RuleManagementEditComponent} from '../_common/rule-management/rule-management-edit/rule-management-edit.component';
import {BusinessUploadComponent} from '../_common/business-upload/business-upload/business-upload.component';
import {ReportsComponent} from '../_common/reports/reports/reports.component';
import {MainComponent} from '../../shared/components/main/main.component';
import {Modules} from '../../../../../shared/enums';
import {AuthorizationGuard} from '../../core/guards/authorization.guard';
import {MeasureComponent} from '../_common/measure/measure/measure.component';
import {MeasureEditComponent} from '../_common/measure/measure-edit/measure-edit.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {moduleId: Modules.prof},
    children: [
      {
        path: 'measure',
        children: [
          {
            path: '', component: MeasureComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'prof-sm:access',
              hero: {
                title: 'Measures',
                desc: 'Create and update measures'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Measure'}]
            }
          },
          {
            path: 'add', component: MeasureEditComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'prof-sm:manage',
              hero: {
                title: 'Add a New Measure',
                desc: 'Add new measure'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Measure', routerUrl: '/prof/measure'}, {label: 'Add New'}]
            }
          },
          {
            path: 'edit/:id', component: MeasureEditComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'prof-sm:manage',
              hero: {
                title: 'Update Measure',
                desc: 'Update the selected measure'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Measure', routerUrl: '/prof/measure'}, {label: 'Update'}]
            }
          }
        ]
      },
      {
        path: 'submeasure',
        children: [
          {
            path: '', component: SubmeasureComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'prof-sm:access',
              hero: {
                title: 'Sub-Measures',
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
                title: 'Add a New Sub-Measure',
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
                title: 'Update Sub-Measure',
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
                title: 'Rule Management',
                desc: 'Create and update rules'
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
                title: 'Create New Rule',
                desc: 'Create a new rule'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management',
                routerUrl: '/prof/rule-management'}, {label: 'Create'}]
            }
          },
          {
            path: 'edit/:id', component: RuleManagementEditComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'prof-rm:manage',
              hero: {
                title: 'Update Rule',
                desc: 'Update the selected rule'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management',
                routerUrl: '/prof/rule-management'}, {label: 'Update'}]
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
            title: 'Business Uploads',
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
            title: 'Reports',
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
