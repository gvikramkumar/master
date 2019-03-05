import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskbarComponent } from './taskbar/taskbar.component';

@NgModule({
  declarations: [TaskbarComponent],
  imports: [
    CommonModule
  ],
  exports:[
    TaskbarComponent
  ]
})
export default class SharedModule { }
