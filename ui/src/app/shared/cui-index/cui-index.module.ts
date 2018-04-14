import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CuiProgressbarModule} from "@cisco-ngx/cui-components";

@NgModule({
  imports: [
    CuiProgressbarModule
  ],
  exports: [
    CuiProgressbarModule
  ],
})
export class CuiIndexModule { }
