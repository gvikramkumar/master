import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTableModule, SharedModule, AccordionModule, DialogModule, PaginatorModule } from 'primeng/primeng';
import { CuiSearchModule, CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


import * as _ from 'lodash';
import { StakeholderAddComponent } from './stakeholder-add/stakeholder-add.component';
import { StakeholderFullComponent } from './stakeholder-full/stakeholder-full.component';


@NgModule({
    declarations: [
        StakeholderAddComponent,
        StakeholderFullComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        AccordionModule,
        DataTableModule,
        PaginatorModule,
        CuiSearchModule,
        CuiTableModule,
        CuiPagerModule,
        DialogModule
    ],
    exports: [
        StakeholderAddComponent,
        StakeholderFullComponent,
        CuiSearchModule,
        CuiTableModule,
        CuiPagerModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class StakeHolderModule { }
