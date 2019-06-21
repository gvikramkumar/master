import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DropdownModule } from 'primeng/primeng';
import { SharedModule } from '@shared/shared.module';
import { TaskBarModule } from '../taskbar/task-bar.module';

import { ACCESS_MANAGEMENT_ROUTES } from './access-management.routes';
import { AccessManagementComponent } from './access-management.component';

@NgModule({
  declarations: [AccessManagementComponent],
  imports: [
    SharedModule,
    TaskBarModule,
    DropdownModule,
    RouterModule.forChild(ACCESS_MANAGEMENT_ROUTES)
  ]
})
export class AccessManagementModule { }
