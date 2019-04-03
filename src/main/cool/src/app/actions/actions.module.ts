import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionsComponent } from './actions.component';
import { CreateNewActionComponent } from './components';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {InputSwitchModule} from 'primeng/inputswitch';

const routes: Routes = [
  { path: '', component: ActionsComponent },
];

@NgModule({
  declarations: [ActionsComponent, CreateNewActionComponent],
  imports: [
    CommonModule,
    SharedModule,
    InputSwitchModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ActionsModule { }
