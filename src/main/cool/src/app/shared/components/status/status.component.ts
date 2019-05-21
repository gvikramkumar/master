import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  finalStatus: string;
  @Input() status: string;

  constructor() { }

  ngOnInit() {

    this.status = this.status.toUpperCase();

    if (this.status === 'COMPLETED') {
      this.finalStatus = 'complete';
    } else if (this.status === 'IN PROGRESS' || this.status === 'REOPEN') {
      this.finalStatus = 'inProgress';
    } else if (this.status === 'NOT STARTED') {
      this.finalStatus = 'notStarted';
    } else if (this.status === 'OFFER NOT PRESENT' || this.status === 'OFFER WORKFLOW NOT SETUP') {
      this.finalStatus = 'offerNotPresent';
    } else {
      this.finalStatus = 'other';
    }
  }


}

