import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from '../../shared/components/main/main.component';
import {AuthorizationGuard} from '../../core/guards/authorization.guard';
import {Modules} from '../../../../../shared/enums';
import {OpenPeriodComponent} from './open-period/open-period.component';
import {SourceComponent} from './source/source.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {moduleId: Modules.admn},
    children: [
      {
        path: 'open-period', component: OpenPeriodComponent,
        canActivate: [AuthorizationGuard],
        data: {
          authorization: 'prof-sm:manage',
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
          authorization: 'prof-sm:manage',
          hero: {
            title: 'Set Sources',
            desc: 'Set available sources for each module'
          },
          breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sources'}]
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
