import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MonetizationModelService } from '@app/services/monetization-model.service';

@Component({
  selector: 'app-offer-create-detail',
  templateUrl: './offer-create-detail.component.html',
  styleUrls: ['./offer-create-detail.component.css']
})
export class OfferCreateDetailComponent implements OnInit {
  offerData: any;
  currentOfferId;
  bviewDeckData: any[];
  choiceSelected;
  groups = {};
  groupKeys = [];
  message = {};
  stakeData = {};
  offerBuilderdata = {};

  constructor(private router: Router, private monetizationModelService: MonetizationModelService,
    private activatedRoute: ActivatedRoute) {
      this.activatedRoute.params.subscribe(params => {
        this.currentOfferId = params['offerId'];
      });
     }

  ngOnInit() {
    this.monetizationModelService.retrieveOfferDimensionAttributes().subscribe(data => {
      this.offerData = data;
      const defaultOfferDataGroups = this.offerData['groups'][0];
      defaultOfferDataGroups['subGroup'].forEach((g) => {
        this.groups[g['subGroupName']] = [];
        g.choices.forEach((c) => {
          this.groups[g['subGroupName']].push({ name: c, type: 0, status: -1 });
        });
      });
      this.groupKeys = Object.keys(this.groups);
    });

    this.monetizationModelService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {
      this.offerBuilderdata = data;
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
