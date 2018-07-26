import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdmnRoutingModule} from './admn-routing.module';
import {DfaCommonModule} from '../_common/dfa-common.module';
import { OpenPeriodComponent } from './open-period/open-period.component';
import { SourceComponent } from './source/source.component';
import { SourceMappingComponent } from './source-mapping/source-mapping.component';


@NgModule({
  imports: [
    CommonModule,
    AdmnRoutingModule,
    DfaCommonModule
  ],
  declarations: [
    OpenPeriodComponent,
    SourceComponent,
    SourceMappingComponent,
  ]
})
export class AdmnModule {
  constructor() {
  }
}
