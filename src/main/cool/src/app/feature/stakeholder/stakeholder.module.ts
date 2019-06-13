import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/primeng';

import * as _ from 'lodash';
import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';
import { StakeholderFullComponent } from './stakeholder-full/stakeholder-full.component';



const routes: Routes = [
    {
        path: '',
        component: StakeholderFullComponent
    },
];

@NgModule({
    declarations: [
        StakeholderFullComponent,
    ],
    imports: [
        TableModule,
        SharedModule,
        TaskBarModule,
        MenuBarModule,
        CheckboxModule,
        AutoCompleteModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        StakeholderFullComponent
    ]
})
export class StakeholderModule { }
