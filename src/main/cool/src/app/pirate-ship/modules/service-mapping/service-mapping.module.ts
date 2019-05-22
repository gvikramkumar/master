import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { SharedModule } from '@shared/shared.module';
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
