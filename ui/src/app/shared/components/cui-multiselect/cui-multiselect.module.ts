import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CuiMultiselectComponent} from './cui-multiselect.component';
import {CuiVScrollModule} from '@cisco-ngx/cui-components';

@NgModule({
  imports: [
    CommonModule,
    CuiVScrollModule,
    FormsModule,
  ],
  declarations: [
    CuiMultiselectComponent,
  ],
  exports: [
    CuiMultiselectComponent,
  ],
})

export class CuiMultiselectModule {
}
