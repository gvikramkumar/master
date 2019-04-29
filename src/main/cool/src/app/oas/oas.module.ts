
import {
    DataTableModule, MessageModule, MessagesModule, AccordionModule,
    DialogModule
} from 'primeng/primeng';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as _ from 'lodash';
import { OasComponent } from './oas.component';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from '@shared/shared.module';


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
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        DialogModule,
        CheckboxModule,
        AccordionModule,
        MessageModule,
        MessagesModule,
        DataTableModule,
        RouterModule.forChild(routes)
    ]
})

export class OasModule { }
