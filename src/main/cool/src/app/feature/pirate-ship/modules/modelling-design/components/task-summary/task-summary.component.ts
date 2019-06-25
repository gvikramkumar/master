import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../../model/task';

@Component({
  selector: 'app-task-summary',
  templateUrl: './task-summary.component.html',
  styleUrls: ['./task-summary.component.scss']
})
export class TaskSummaryComponent implements OnInit {

  @Input() tasks: Array<Task>;
  @Input() owbPunchOut: boolean;

  constructor() { }

  ngOnInit() {
  }

}
