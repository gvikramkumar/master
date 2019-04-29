import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule, AutoCompleteModule, PaginatorModule, DialogModule } from 'primeng/primeng';
import { NgModule } from '@angular/core';

import * as _ from 'lodash';
import { StakeholderFullComponent } from '@app/stakeholder/stakeholder-full/stakeholder-full.component';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';


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
