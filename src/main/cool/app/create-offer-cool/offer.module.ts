import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';

import * as _ from 'lodash';
import { CreateOfferCoolComponent } from './create-offer-cool.component';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '../menu/menu-bar.module';

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
        SharedModule,
        MenuBarModule,
        DropdownModule,
        RouterModule.forChild(routes)
    ]
})
export class OfferModule { }
