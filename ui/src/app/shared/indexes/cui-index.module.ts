import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CuiButtonModule, CuiDialogModule,
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
    // CuiSelectModule,
    // CuiMultiselectModule,
    CuiTableModule,
    CuiToastModule,
    CuiSpinnerModule,
    FromNowPipeModule,
    CuiDialogModule,
  ],
  exports: [
    CuiButtonModule,
    CuiHeaderModule,
    CuiFooterModule,
    CuiSearchModule,
    CuiInputModule,
    // CuiSelectModule,
    // CuiMultiselectModule,
    CuiTableModule,
    CuiToastModule,
    CuiSpinnerModule,
    FromNowPipeModule,
    CuiDialogModule,
  ],
})
export class CuiIndexModule { }
