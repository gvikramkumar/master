import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrdtRoutingModule} from './prdt-routing.module';
import {DfaCommonModule} from '../_common/dfa-common.module';


@NgModule({
  imports: [
    CommonModule,
    PrdtRoutingModule,
    DfaCommonModule
  ]
})
export class PrdtModule {
  constructor() {
  }
}
