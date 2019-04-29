import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/primeng';

import * as _ from 'lodash';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';

import { StakeholderFullComponent } from '@app/stakeholder/stakeholder-full/stakeholder-full.component';

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
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TaskBarModule,
        MenuBarModule,
        TableModule,
        CheckboxModule,
        AutoCompleteModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        StakeholderFullComponent
    ]
})
export class StakeholderModule { }
