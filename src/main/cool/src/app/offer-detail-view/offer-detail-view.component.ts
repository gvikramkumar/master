import { Component, OnInit } from '@angular/core';
import { OfferDetailViewService } from '../services/offer-detail-view.service';
import { ActivatedRoute } from '@angular/router';
import { StakeHolder } from '../models/stakeholder';


@Component({
  selector: 'app-offer-detail-view',
  templateUrl: './offer-detail-view.component.html',
  styleUrls: ['./offer-detail-view.component.css']
})
export class OfferDetailViewComponent implements OnInit {
  currentOfferId;
  offerViewData;
  offerRole;
  offerOwnerList: StakeHolder[] = [];
  offerCoOwnerList: StakeHolder[] = [];
  offerStakeHolderList: StakeHolder[] = [];
  stakeName = 'John Smith';
  email;
  functionalRole;
  constructor(private activatedRoute: ActivatedRoute, private offerDetailViewService: OfferDetailViewService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
    });
  }

  ngOnInit() {
    this.offerDetailViewService.offerDetailView(this.currentOfferId)
      .subscribe(data => {
        this.offerViewData = data;
        this.offerRole = data.stakeholders[0].offerRole;
        this.email = data.stakeholders[0]._id;
        this.functionalRole = data.stakeholders[0].functionalRole;
        console.log(this.offerViewData);
      });
  }

  onExportPdf() {
    // this.offerDetailViewService.export().subscribe(data => saveAs(data, `pdf report.pdf`));
  }

}
