import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { RightPanelModule } from '@app/feature/right-panel/right-panel.module';
import * as _ from 'lodash';
import { TreeTableModule, AutoCompleteModule } from 'primeng/primeng';

import { CHANGE_STATUS_ROUTES } from './changestatus.routes';
import {ChangestatusComponent } from './changestatus.component';
import { ShareModalComponent } from './share-modal/share-modal.component';
import { SharedataService } from './sharedata.service';
import { UploadDocComponent } from './upload-doc/upload-doc.component';

@NgModule({
    declarations: [
        ChangestatusComponent,
        ShareModalComponent,
        UploadDocComponent
    ],
    imports: [
        SharedModule,
        MenuBarModule,
        TreeTableModule,
        RightPanelModule,
        AutoCompleteModule,
        RouterModule.forChild(CHANGE_STATUS_ROUTES)
    ],
    providers: [
        SharedataService
    ],
    exports: [
        RouterModule
    ]
})

export class ChangestatusModule { }
