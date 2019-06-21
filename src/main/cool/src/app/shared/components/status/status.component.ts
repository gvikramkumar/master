import { Component, OnInit, Input } from '@angular/core';
import { pirateShipRoutesNames } from '../../constants/pirateShipStatus';

import * as _ from 'lodash';

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

    this.status = _.isEmpty(this.status) ? '' : this.status.toUpperCase();

    if (this.status === pirateShipRoutesNames.Y || this.status === pirateShipRoutesNames.COMPLETED) {
      this.finalStatus = 'complete';
    } else if (this.status === pirateShipRoutesNames.N || this.status === pirateShipRoutesNames.IN_PROGRESS) {
      this.finalStatus = 'inProgress';
    } else if (this.status === pirateShipRoutesNames.AVAILABLE) {
      this.finalStatus = 'available';
    } else if (this.status === pirateShipRoutesNames.NOT_APPLICABLE
      || this.status === pirateShipRoutesNames.NOT_YET_AVAILABLE) {
      this.finalStatus = 'offerNotAvailable';
    } else {
      this.finalStatus = 'other';
    }

  }

}

