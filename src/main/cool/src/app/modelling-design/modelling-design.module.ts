import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AtoListComponent } from './ato-list/ato-list.component';
import { AtoMainComponent } from './ato-main/ato-main.component';
import { AtoSummaryComponent } from './ato-summary/ato-summary.component';

@NgModule({
  declarations: [
    AtoSummaryComponent,
    AtoListComponent,
    AtoMainComponent,
    ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    DataTableModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModellingDesignModule { }
