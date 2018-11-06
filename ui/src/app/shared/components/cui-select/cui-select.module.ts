import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CuiSelectComponent} from './cui-select.component';
import {CuiVScrollModule} from '@cisco-ngx/cui-components';

@NgModule({
  imports: [
    CommonModule,
    CuiVScrollModule,
    FormsModule,
  ],
  declarations: [
    CuiSelectComponent,
  ],
  exports: [
    CuiSelectComponent,
  ],
})

export class CuiSelectModule {
}
