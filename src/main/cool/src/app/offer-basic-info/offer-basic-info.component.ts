import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MonetizationModelService } from '../services/monetization-model.service';

@Component({
  selector: 'app-offer-basic-info',
  templateUrl: './offer-basic-info.component.html',
  styleUrls: ['./offer-basic-info.component.css']
})
export class OfferBasicInfoComponent implements OnInit {
  public offerBuilderdata = {};
  currentOfferId;
  caseId;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private monetizationModelService: MonetizationModelService
    ) {this.activatedRoute.params.subscribe(params => {

      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
  }
  
  ngOnInit() {
    let that = this;
    this.monetizationModelService.getOfferBuilderData(this.currentOfferId).subscribe(data => {
      that.offerBuilderdata = data;
      that.offerBuilderdata['BEList'] = [];
      that.offerBuilderdata['BUList'] = [];
      if (that.offerBuilderdata['primaryBEList'] != null) {
        that.offerBuilderdata['BEList'] = that.offerBuilderdata['BEList'].concat(that.offerBuilderdata['primaryBEList']);
      }
      if (that.offerBuilderdata['secondaryBEList'] != null) {
        that.offerBuilderdata['BEList'] = that.offerBuilderdata['BEList'].concat(that.offerBuilderdata['secondaryBEList']);
      }
      if (that.offerBuilderdata['primaryBUList'] != null) {
        that.offerBuilderdata['BUList'] = that.offerBuilderdata['BUList'].concat(that.offerBuilderdata['primaryBUList']);
      }
      if (that.offerBuilderdata['secondaryBUList'] != null) {
        that.offerBuilderdata['BUList'] = that.offerBuilderdata['BUList'].concat(that.offerBuilderdata['secondaryBUList']);
      }
    });
  }

}
