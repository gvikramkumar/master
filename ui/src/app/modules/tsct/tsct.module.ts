import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DfaCommonModule} from '../_common/dfa-common.module';
import { TsctRoutingModule } from './tsct-routing.module';


@NgModule({
  imports: [
    CommonModule,
    TsctRoutingModule,
    DfaCommonModule
  ]
})
export class TsctModule {
  constructor() {
  }
}
