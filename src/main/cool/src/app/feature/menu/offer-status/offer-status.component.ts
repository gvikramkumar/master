import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'app-offer-status',
  templateUrl: './offer-status.component.html',
  styleUrls: ['./offer-status.component.css']
})
export class OfferStatusComponent implements OnInit {

  @Input() status: string;

  constructor() { }

  ngOnInit() {

    this.status = _.isEmpty(this.status) ? '' : this.status.toLowerCase();

  }

}
