import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DfaCommonModule} from '../_common/dfa-common.module';
import { BkgmRoutingModule } from './bkgm-routing.module';


@NgModule({
  imports: [
    CommonModule,
    BkgmRoutingModule,
    DfaCommonModule
  ]
})
export class ProfModule {
  constructor() {
  }
}
