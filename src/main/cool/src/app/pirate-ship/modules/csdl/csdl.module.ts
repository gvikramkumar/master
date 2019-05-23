import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CsdlPlatformComponent } from './csdl-platform/csdl-platform.component';
import { SharedModule } from '@shared/shared.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';
import { RouterModule } from '@angular/router';
import { CSDL_ROUTES } from './csdl-routing.module';
import { CsdlStatusTrackComponent } from './csdl-status-track/csdl-status-track.component';

@NgModule({
  declarations: [CsdlPlatformComponent, CsdlStatusTrackComponent],
  imports: [
    CommonModule,
    SharedModule,
    TaskBarModule,
    MenuBarModule,
    RightPanelModule,
    OfferDetailModule,
    RouterModule.forChild(CSDL_ROUTES)
  ], entryComponents: [
    CsdlStatusTrackComponent
  ],
})
export class CsdlModule { }
