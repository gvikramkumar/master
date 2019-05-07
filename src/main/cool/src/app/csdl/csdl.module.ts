import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CsdlPlatformComponent } from './csdl-platform/csdl-platform.component';
import { SharedModule } from '@shared/shared.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';
import { RouterModule } from '@angular/router';
import { routes } from './csdl-routing.module';

@NgModule({
  declarations: [CsdlPlatformComponent],
  imports: [
    CommonModule,
    SharedModule,
    TaskBarModule,
    MenuBarModule,
    RightPanelModule,
    OfferDetailModule,
    RouterModule.forChild(routes)
  ]
})
export class CsdlModule { }
