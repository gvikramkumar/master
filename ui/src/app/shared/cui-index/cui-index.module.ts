import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CuiButtonModule,
  CuiFooterModule,
  CuiHeaderModule, CuiInputModule,
  CuiProgressbarModule,
  CuiSearchModule, CuiSelectModule, CuiSpinnerModule,
  CuiTableModule, CuiToastModule
} from '@cisco-ngx/cui-components';

@NgModule({
  imports: [
    CuiButtonModule,
    CuiHeaderModule,
    CuiFooterModule,
    CuiSearchModule,
    CuiInputModule,
    CuiSelectModule,
    CuiTableModule,
    CuiToastModule,
    CuiSpinnerModule
  ],
  exports: [
    CuiButtonModule,
    CuiHeaderModule,
    CuiFooterModule,
    CuiSearchModule,
    CuiInputModule,
    CuiSelectModule,
    CuiTableModule,
    CuiToastModule,
    CuiSpinnerModule
  ],
})
export class CuiIndexModule { }
