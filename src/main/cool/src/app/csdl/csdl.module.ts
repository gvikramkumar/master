import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CsdlRoutingModule } from './csdl-routing.module';
import { CsdlPlatformComponent } from './csdl-platform/csdl-platform.component';

@NgModule({
  declarations: [CsdlPlatformComponent],
  imports: [
    CommonModule,
    CsdlRoutingModule
  ]
})
export class CsdlModule { }
