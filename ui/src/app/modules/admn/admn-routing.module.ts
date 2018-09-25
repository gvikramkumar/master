import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from '../../shared/components/main/main.component';
import {AuthorizationGuard} from '../../core/guards/authorization.guard';
import {DfaModuleIds} from '../../../../../shared/enums';
import {OpenPeriodComponent} from './open-period/open-period.component';
import {SourceComponent} from './source/source.component';
import {SourceMappingComponent} from './source-mapping/source-mapping.component';
import {ModuleComponent} from './module/module.component';
import {DatabaseSyncComponent} from './database-sync/database-sync.component';
import {UserAuthorizationGuard} from '../../core/guards/user-authorization.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {moduleId: DfaModuleIds.admn},
    children: [
      {
        path: 'module', component: ModuleComponent,
        canActivate: [AuthorizationGuard],
        data: {
          authorization: 'itadmin',
          hero: {
            title: 'Manage Modules',
            desc: 'Create and configure modules'
          },
          breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Open Period'}]
        }
      },
      {
        path: 'open-period', component: OpenPeriodComponent,
        canActivate: [AuthorizationGuard],
        data: {
          authorization: 'itadmin',
          hero: {
            title: 'Set Open Period',
            desc: 'Set open period for modules'
          },
          breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Open Period'}]
        }
      },
      {
        path: 'source', component: SourceComponent,
        canActivate: [AuthorizationGuard],
        data: {
          authorization: 'itadmin',
          hero: {
            title: 'Set Sources',
            desc: 'Configure sources for all modules'
          },
          breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sources'}]
        }
      },
      {
        path: 'source-mapping', component: SourceMappingComponent,
        canActivate: [AuthorizationGuard],
        data: {
          authorization: 'itadmin',
          hero: {
            title: 'Source Mapping',
            desc: 'Assign active sources to be available for each module'
          },
          breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Source Mapping'}]
        }
      },
      {
        path: 'database-sync', component: DatabaseSyncComponent,
        canActivate: [AuthorizationGuard],
        data: {
          authorization: 'itadmin',
          hero: {
            title: 'Database Sync',
            desc: 'Sync data from postgres to mongo and mongo to postgres'
          },
          breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Database Sync'}]
        }
      },
      // admin pages go here, just like module pages do,
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
export class AdmnRoutingModule {

}
