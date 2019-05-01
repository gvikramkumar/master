import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../model/task';

@Component({
  selector: 'app-ato-summary',
  templateUrl: './ato-summary.component.html',
  styleUrls: ['./ato-summary.component.scss']
})
export class AtoSummaryComponent implements OnInit {

  @Input() tasks: Array<Task>;

  constructor() { }

  ngOnInit() {
  }

}
