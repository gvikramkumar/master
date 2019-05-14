import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';

import { RouterModule } from '@angular/router';
import { TC_MAPPING_ROUTES } from './tc-mapping.routes';

import { TcMappingComponent } from './tc-mapping.component';

@NgModule({
  declarations: [
    TcMappingComponent  ],
  imports: [
    SharedModule,
    TaskBarModule,
    MenuBarModule,
    RightPanelModule,
    OfferDetailModule,
    RouterModule.forChild(TC_MAPPING_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class TcMappingModule { }
