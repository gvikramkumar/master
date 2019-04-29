import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import * as _ from 'lodash';
import { OasComponent } from './oas.component';


const routes: Routes = [
    {
        path: '',
        component: OasComponent
    },
];

@NgModule({
    declarations: [
        OasComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        SharedModule,
        DataTableModule,
        RouterModule.forChild(routes)
    ]
})

export class OasModule { }
