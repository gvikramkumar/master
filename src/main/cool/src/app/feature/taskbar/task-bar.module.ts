import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskbarComponent } from './taskbar.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    TaskbarComponent,
    ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule
  ],
  exports:[
    TaskbarComponent
  ]
})
export class TaskBarModule { }
