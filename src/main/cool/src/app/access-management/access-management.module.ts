import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AccessManagementComponent } from './access-management.component';
import { AuthGuard } from '@app/core/guards';
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
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AccessManagementModule { }
