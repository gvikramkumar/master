import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { RightPanelModule } from '@app/feature/right-panel/right-panel.module';
import { SharedModule } from '@shared/shared.module';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';
import * as _ from 'lodash';
import { TreeTableModule, AutoCompleteModule } from 'primeng/primeng';

import { SERVICE_MAPPING_ROUTES } from './service-mapping.routes';
import { ServiceMappingComponent } from './service-mapping.component';

@NgModule({
    declarations: [
        ServiceMappingComponent
    ],
    imports: [
        SharedModule,
        MenuBarModule,
        TaskBarModule,
        TreeTableModule,
        RightPanelModule,
        AutoCompleteModule,
        RouterModule.forChild(SERVICE_MAPPING_ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class ServiceMappingModule { }
