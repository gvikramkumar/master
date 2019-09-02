import {NgModule} from '@angular/core';
import {SubmeasureComponent} from '../_common/submeasure/submeasure/submeasure.component';
import {SubmeasureEditComponent} from '../_common/submeasure/submeasure-edit/submeasure-edit.component';
import {RuleManagementComponent} from '../_common/rule-management/rule-management/rule-management.component';
import {RouterModule, Routes} from '@angular/router';
import {RuleManagementEditComponent} from '../_common/rule-management/rule-management-edit/rule-management-edit.component';
import {ReportsComponent} from '../_common/reports/reports/reports.component';
import {MainComponent} from '../../shared/components/main/main.component';
import {DfaModuleIds} from '../../../../../shared/misc/enums';
import {AuthorizationGuard} from '../../core/guards/authorization.guard';
import {MeasureComponent} from '../_common/admin/measure/measure/measure.component';
import {MeasureEditComponent} from '../_common/admin/measure/measure-edit/measure-edit.component';
import {ApprovalComponent} from '../_common/admin/approval/approval.component';
import {ProcessingDateInputComponent} from '../_common/admin/processing-date-input/processing-date-input.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {moduleId: DfaModuleIds.bkgm},
    children: [
      {
        path: 'admin',
        children: [
          {
            path: 'measure',
            children: [
              {
                path: '', component: MeasureComponent,
                canActivate: [AuthorizationGuard],
                data: {
                  authorization: 'bookings misc allocations:business admin',
                  hero: {
                    title: 'Measures',
                    desc: 'Create and update measures'
                  },
                  breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Admin'}, {label: 'Measure'}]
                }
              },
              {
                path: 'add', component: MeasureEditComponent,
                canActivate: [AuthorizationGuard],
                data: {
                  authorization: 'bookings misc allocations:business admin',
                  hero: {
                    title: 'Add a New Measure',
                    desc: 'Add new measure'
                  },
                  breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Admin'},
                    {label: 'Measure', routerUrl: '/bkgm/admin/measure'}, {label: 'Add New'}]
                }
              },
              {
                path: 'edit/:id', component: MeasureEditComponent,
                canActivate: [AuthorizationGuard],
                data: {
                  authorization: 'bookings misc allocations:business admin',
                  hero: {
                    title: 'Update Measure',
                    desc: 'Update the selected measure'
                  },
                  breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Admin'},
                    {label: 'Measure', routerUrl: '/bkgm/admin/measure'}, {label: 'Update'}]
                }
              },
            ]
          },
          {
            path: 'approval', component: ApprovalComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'bookings misc allocations:business admin',
              hero: {
                title: 'Approval',
                desc: 'Handle Rule and Submeasure items submitted for approval'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Approval'}]
            }
          },
          {
            path: 'processing-date-input', component: ProcessingDateInputComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'bookings misc allocations:business admin',
              hero: {
                title: 'Processing Date - Input',
                desc: 'Handle Rule and Submeasure items submitted for approval'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Processing Date - Input'}]
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
              authorization: 'bookings misc allocations:business admin, bookings misc allocations:super user, bookings misc allocations:business user, bookings misc allocations:end user',
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
              authorization: 'bookings misc allocations:business admin, bookings misc allocations:super user',
              hero: {
                title: 'Add a New Sub-Measure',
                desc: 'Add new sub-measure'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure', routerUrl: '/bkgm/submeasure'}, {label: 'Add New'}]
            }
          },
          {
            path: 'edit/:id', component: SubmeasureEditComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'bookings misc allocations:business admin, bookings misc allocations:super user',
              hero: {
                title: 'Update Sub-Measure',
                desc: 'Update the selected sub-measure'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure', routerUrl: '/bkgm/submeasure'}, {label: 'Update'}]
            }
          },
          {
            path: 'view/:id', component: SubmeasureEditComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'bookings misc allocations:business admin, bookings misc allocations:super user, bookings misc allocations:business user, bookings misc allocations:end user',
              hero: {
                title: 'View Sub-Measure',
                desc: 'View the selected sub-measure'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure', routerUrl: '/bkgm/submeasure'}, {label: 'View'}]
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
              authorization: 'bookings misc allocations:business admin, bookings misc allocations:super user, bookings misc allocations:business user, bookings misc allocations:end user',
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
              authorization: 'bookings misc allocations:business admin, bookings misc allocations:super user',
              hero: {
                title: 'Create New Rule',
                desc: 'Create a new rule'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management',
                routerUrl: '/bkgm/rule-management'}, {label: 'Add New'}]
            }
          },
          {
            path: 'edit/:id', component: RuleManagementEditComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'bookings misc allocations:business admin, bookings misc allocations:super user',
              hero: {
                title: 'Update Rule',
                desc: 'Update the selected rule'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management',
                routerUrl: '/bkgm/rule-management'}, {label: 'Update'}]
            }
          },
          {
            path: 'view/:id', component: RuleManagementEditComponent,
            canActivate: [AuthorizationGuard],
            data: {
              authorization: 'bookings misc allocations:business admin, bookings misc allocations:super user, bookings misc allocations:business user, bookings misc allocations:end user',
              hero: {
                title: 'View Rule',
                desc: 'View the selected rule'
              },
              breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Rule Management',
                routerUrl: '/bkgm/rule-management'}, {label: 'View'}]
            }
          }
        ],
      },
      {
        path: 'reports', component: ReportsComponent,
        canActivate: [AuthorizationGuard],
        data: {
          authorization: 'bookings misc allocations:business admin, bookings misc allocations:super user, bookings misc allocations:business user, bookings misc allocations:end user',
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
export class BkgmRoutingModule {

}
