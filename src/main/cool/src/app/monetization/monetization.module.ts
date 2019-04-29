import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import * as _ from 'lodash';
import { MmAssesmentComponent } from './mm-assesment/mm-assesment.component';
import { MmInfoBarComponent } from './mm-info-bar/mm-info-bar.component';
import { MmMessageBarComponent } from './mm-message-bar/mm-message-bar.component';
import { TaskBarModule } from '../taskbar/task-bar.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';


const routes: Routes = [
    {
        path: '',
        component: MmAssesmentComponent
    },
];

@NgModule({
    declarations: [
        MmInfoBarComponent,
        MmAssesmentComponent,
        MmMessageBarComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        SharedModule,
        TaskBarModule,
        MenuBarModule,
        RightPanelModule,
        RouterModule.forChild(routes)
    ],
    providers: [

    ]
    ,
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MonetizationModule { }
