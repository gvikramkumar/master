import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CuiSearchModule, CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';
import { DataTableModule, AccordionModule, DialogModule, PaginatorModule } from 'primeng/primeng';

import * as _ from 'lodash';
import { StakeholderAddComponent } from './stakeholder-add/stakeholder-add.component';
import { RightPanelComponent } from './right-panel-main/right-panel.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    declarations: [
        RightPanelComponent,
        StakeholderAddComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        AccordionModule,
        PaginatorModule,
        DialogModule,
        DataTableModule,
        CuiSearchModule,
        CuiTableModule,
        CuiPagerModule,
        SharedModule,
        BsDatepickerModule.forRoot(),
    ],
    exports: [
        RightPanelComponent,
        BsDatepickerModule,
        StakeholderAddComponent
    ],
})

export class RightPanelModule { }
