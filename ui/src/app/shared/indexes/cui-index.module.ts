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
import {FromNowPipeModule} from '@cisco-ngx/cui-pipes';

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
    CuiSpinnerModule,
    FromNowPipeModule
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
    CuiSpinnerModule,
    FromNowPipeModule
  ],
})
export class CuiIndexModule { }
