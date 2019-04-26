import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTableModule, AccordionModule, DialogModule, PaginatorModule } from 'primeng/primeng';
import { NgModule } from '@angular/core';


import * as _ from 'lodash';
import { RightPanelComponent } from '@app/right-panel/right-panel-main/right-panel.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { StakeholderAddComponent } from './stakeholder-add/stakeholder-add.component';
import { CuiSearchModule, CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';

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
        BsDatepickerModule.forRoot(),
    ],
    exports: [
        RightPanelComponent,
        BsDatepickerModule,
        StakeholderAddComponent
    ],
})

export class RightPanelModule { }
