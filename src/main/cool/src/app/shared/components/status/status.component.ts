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

    if (this.status === 'Completed') {
      this.finalStatus = 'Complete';
    } else if (this.status === 'In Progress' || this.status === 'Reopen') {
      this.finalStatus = 'InProgress';
    } else if (this.status === 'Not Started') {
      this.finalStatus = 'NotStarted';
    } else if (this.status === 'Offer Not Present' || this.status === 'Offer workflow not setup') {
      this.finalStatus = 'OfferNotPresent';
    } else {
      this.finalStatus = 'Other';
    }
  }


}
