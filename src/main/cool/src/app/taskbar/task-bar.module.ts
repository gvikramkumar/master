import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskbarComponent } from '@app/taskbar/taskbar.component';


@NgModule({
  declarations: [
    TaskbarComponent,
    ],
  imports: [
    FormsModule,
    CommonModule,
  ],
  exports:[
    TaskbarComponent
  ]
})
export class TaskBarModule { }
