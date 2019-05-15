import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  @Input() status: string;

  constructor() { }

  ngOnInit() {
  }

  checkAvailable() {
    if (this.status === 'Completed' || this.status === 'Not Started') {
      return true;
    } else {
      return false;
    }
  }

  checkInProgress() {
    if (this.status === 'In Progress' || this.status === 'Reopen') {
      return true;
    } else {
      return false;
    }
  }
}

