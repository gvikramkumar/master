import { NgModule } from '@angular/core';
import { AuthGuard } from '@app/core/guards';
import { Routes, RouterModule } from '@angular/router';
import { AccessManagementComponent } from './access-management.component';

import { SharedModule } from '@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AccessManagementComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [AccessManagementComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AccessManagementModule { }
