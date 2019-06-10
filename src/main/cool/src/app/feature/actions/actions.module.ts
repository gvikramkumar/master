import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';

import { ACTIONS_ROUTES } from './actions.routes';
import { ActionsComponent } from './actions.component';

@NgModule({
  declarations: [ActionsComponent],
  imports: [
    SharedModule,
    TaskBarModule,
    InputSwitchModule,
    RouterModule.forChild(ACTIONS_ROUTES)
  ]
})
export class ActionsModule { }
