import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CsdlPlatformComponent } from './csdl-platform/csdl-platform.component';

const routes: Routes = [
  {
    path: 'csdl-platform',
    component: CsdlPlatformComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CsdlRoutingModule { }
