import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTableModule, AccordionModule, DialogModule, PaginatorModule } from 'primeng/primeng';
import { NgModule } from '@angular/core';


import * as _ from 'lodash';
import { RightPanelComponent } from '../right-panel/right-panel.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { StakeHolderModule } from '../stakeholder/stakeholder.module';

@NgModule({
    declarations: [
        RightPanelComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        AccordionModule,
        DataTableModule,
        PaginatorModule,
        DialogModule,
        DataTableModule,
        StakeHolderModule,
        BsDatepickerModule.forRoot(),
    ],
    exports: [
        RightPanelComponent,
        BsDatepickerModule
    ],
})

export class RightPanelModule { }
