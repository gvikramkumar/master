import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfRoutingModule} from './prof-routing.module';
import {DfaCommonModule} from '../_common/dfa-common.module';


@NgModule({
  imports: [
    CommonModule,
    ProfRoutingModule,
    DfaCommonModule
  ]
})
export class ProfModule {
  constructor() {
  }
}
