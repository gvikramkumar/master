import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule, SharedModule, MessageModule, MessagesModule, AccordionModule, DialogModule } from 'primeng/primeng';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import * as _ from 'lodash';
import { OasComponent } from './oas.component';
import { CheckboxModule } from 'primeng/checkbox';


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
