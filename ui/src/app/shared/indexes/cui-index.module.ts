import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CuiButtonModule,
  CuiFooterModule,
  CuiHeaderModule, CuiInputModule, CuiMultiselectModule,
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
    CuiTableModule,
    CuiToastModule,
    CuiSpinnerModule,
    FromNowPipeModule,
    CuiProgressbarModule,
    CuiSelectModule,
    CuiMultiselectModule,
  ],
  exports: [
    CuiButtonModule,
    CuiHeaderModule,
    CuiFooterModule,
    CuiSearchModule,
    CuiInputModule,
    CuiTableModule,
    CuiToastModule,
    CuiSpinnerModule,
    FromNowPipeModule,
    CuiProgressbarModule,
    CuiSelectModule,
    CuiMultiselectModule,
  ],
})
export class CuiIndexModule { }
