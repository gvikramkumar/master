import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offer-popup',
  templateUrl: './offer-popup.component.html',
  styleUrls: ['./offer-popup.component.css']
})
export class OfferPopupComponent implements OnInit {

  @Input() offerBuilderdata: any;

  constructor(
  ) {

  }

  ngOnInit() {

    this.offerBuilderdata['overallStatus'] = this.offerBuilderdata && this.offerBuilderdata['overallStatus'] ?
      this.offerBuilderdata['overallStatus'].toLowerCase() : '';

  }


}
