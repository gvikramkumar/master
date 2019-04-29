import { NgModule } from '@angular/core';
import { ActionsComponent } from './actions.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { CoreModule } from '../core/core.module';

const routes: Routes = [
  { path: '', component: ActionsComponent },
];

@NgModule({
  declarations: [ActionsComponent],
  imports: [
    CoreModule,
    SharedModule,
    TaskBarModule,
    InputSwitchModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ActionsModule { }
