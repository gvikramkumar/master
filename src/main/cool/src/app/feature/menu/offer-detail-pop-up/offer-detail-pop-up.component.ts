import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offer-detail-pop-up',
  templateUrl: './offer-detail-pop-up.component.html',
  styleUrls: ['./offer-detail-pop-up.component.css']
})
export class OfferDetailPopUpComponent implements OnInit {

  @Input() offerBuilderdata: any;

  constructor(
  ) {

  }

  ngOnInit() {   
  }

}
