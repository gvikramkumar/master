import { Component, OnInit, Input } from '@angular/core';
import { pirateShipRoutesNames } from '../../constants/pirateShipStatus';

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

    if (this.status === pirateShipRoutesNames.YES || this.status === pirateShipRoutesNames.COMPLETED) {
      this.finalStatus = 'complete';
    } else if (this.status === pirateShipRoutesNames.IN_PROGRESS || this.status === pirateShipRoutesNames.REOPEN) {
      this.finalStatus = 'inProgress';
    } else if (this.status === pirateShipRoutesNames.NOT_STARTED || this.status === 'AVAILABLE') {
      this.finalStatus = 'notStarted';
    } else if (this.status === pirateShipRoutesNames.NO || pirateShipRoutesNames.OFFER_NOT_PRESENT
      || this.status === pirateShipRoutesNames.OFFER_WORKFLOW_NOT_SETUP) {
      this.finalStatus = 'offerNotPresent';
    } else {
      this.finalStatus = 'other';
    }
  }


}

