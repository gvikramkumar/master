import { Component, OnInit, Input } from '@angular/core';
import { OfferDetailViewService } from '@app/services/offer-detail-view.service';

@Component({
  selector: 'app-offer-detail-pop-up',
  templateUrl: './offer-detail-pop-up.component.html',
  styleUrls: ['./offer-detail-pop-up.component.css']
})
export class OfferDetailPopUpComponent implements OnInit {

  offerBuilderdata: any;

  @Input() offerId: string;


  constructor(private offerDetailViewService: OfferDetailViewService
  ) {

  }

  ngOnInit() {

    this.offerDetailViewService.retrieveOfferDetails(this.offerId).subscribe(offerBuilderdata => {

      this.offerBuilderdata = offerBuilderdata;

      this.offerBuilderdata['BEList'] = [];
      this.offerBuilderdata['BUList'] = [];
      if (this.offerBuilderdata['primaryBEList'] != null) {
        this.offerBuilderdata['BEList'] = this.offerBuilderdata['BEList'].concat(this.offerBuilderdata['primaryBEList']);
      }
      if (this.offerBuilderdata['secondaryBEList'] != null) {
        this.offerBuilderdata['BEList'] = this.offerBuilderdata['BEList'].concat(this.offerBuilderdata['secondaryBEList']);
      }
      if (this.offerBuilderdata['primaryBUList'] != null) {
        this.offerBuilderdata['BUList'] = this.offerBuilderdata['BUList'].concat(this.offerBuilderdata['primaryBUList']);
      }
      if (this.offerBuilderdata['secondaryBUList'] != null) {
        this.offerBuilderdata['BUList'] = this.offerBuilderdata['BUList'].concat(this.offerBuilderdata['secondaryBUList']);
      }

    });

  }

}
