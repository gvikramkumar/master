import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CuiFooterModule,
  CuiHeaderModule, CuiInputModule,
  CuiProgressbarModule,
  CuiSearchModule, CuiSelectModule,
  CuiTableModule, CuiToastModule
} from "@cisco-ngx/cui-components";

@NgModule({
  imports: [
    CuiHeaderModule,
    CuiFooterModule,
    CuiSearchModule,
    CuiInputModule,
    CuiSelectModule,
    CuiTableModule,
    CuiToastModule
  ],
  exports: [
    CuiHeaderModule,
    CuiFooterModule,
    CuiSearchModule,
    CuiInputModule,
    CuiSelectModule,
    CuiTableModule,
    CuiToastModule
  ],
})
export class CuiIndexModule { }
