import { NgModule } from '@angular/core';
import { ActionsComponent } from './actions.component';
import { CreateNewActionComponent } from './components';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {InputSwitchModule} from 'primeng/inputswitch';
import { TaskBarModule } from '@app/taskbar/task-bar.module';

const routes: Routes = [
  { path: '', component: ActionsComponent },
];

@NgModule({
  declarations: [ActionsComponent, CreateNewActionComponent],
  imports: [
    SharedModule,
    TaskBarModule,
    InputSwitchModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ActionsModule { }
