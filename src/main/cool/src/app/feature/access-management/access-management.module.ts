import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { ACCESS_MANAGEMENT_ROUTES } from './access-management.routes';
import { AccessManagementComponent } from './access-management.component';
import { DropdownModule } from 'primeng/primeng';


@NgModule({
  declarations: [AccessManagementComponent],
  imports: [
    SharedModule,
    DropdownModule,
    RouterModule.forChild(ACCESS_MANAGEMENT_ROUTES)
  ]
})
export class AccessManagementModule { }
