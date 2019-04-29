import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import * as _ from 'lodash';
import { CreateOfferCoolComponent } from './create-offer-cool.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';


const routes: Routes = [
    {
        path: '',
        component: CreateOfferCoolComponent
    },
];

@NgModule({
    declarations: [
        CreateOfferCoolComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        DropdownModule,
        BsDatepickerModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    providers: [

    ]
    ,
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OfferModule { }
