import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { RightPanelModule } from '@app/feature/right-panel/right-panel.module';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';
import * as _ from 'lodash';
import { TreeTableModule, AutoCompleteModule } from 'primeng/primeng';

import { ITEM_CREATION_ROUTES } from './item-creation.routes';
import { ItemCreationComponent } from './item-creation.component';

@NgModule({
    declarations: [
        ItemCreationComponent
    ],
    imports: [
        SharedModule,
        MenuBarModule,
        TaskBarModule,
        TreeTableModule,
        RightPanelModule,
        AutoCompleteModule,
        RouterModule.forChild(ITEM_CREATION_ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class ItemCreationModule { }
