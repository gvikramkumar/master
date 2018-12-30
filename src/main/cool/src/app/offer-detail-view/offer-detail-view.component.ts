import { Component, OnInit } from '@angular/core';
import { OfferDetailViewService } from '../services/offer-detail-view.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StakeHolder } from '../models/stakeholder';
import {Location} from '@angular/common';


@Component({
  selector: 'app-offer-detail-view',
  templateUrl: './offer-detail-view.component.html',
  styleUrls: ['./offer-detail-view.component.css']
})
export class OfferDetailViewComponent implements OnInit {
  currentOfferId;
  offerViewData;
  offerRole;
  offerOwner;
  offerCoOwnerList: StakeHolder[] = [];
  offerStakeHolderList: StakeHolder[] = [];
  stakeName;
  email;
  functionalRole;
  caseId;
  obj = {
  };
  offerOverviewDetailsList;
  strategyReviewList = [
    {
      function : 'CPS',
      approvalStatus : 'Approved',
      reviewedOn : '11-Aug-2018',
      reviewedBy : 'Sean Parker (OPS)',
      comment : 'Comment'
    },
    {
      function : 'CPS',
      approvalStatus : 'Approved',
      reviewedOn : '11-Aug-2018',
      reviewedBy : 'Sean Parker (OPS)',
      comment : 'Comment'
    },
    {
      function : 'Compensation Ops',
      approvalStatus : 'Conditionally Approved',
      reviewedOn : '06-Aug-2018',
      reviewedBy : 'Jessica Lara',
      comment : 'Comment'
    },
    {
      function : 'Compensation Ops',
      approvalStatus : 'Conditionally Approved',
      reviewedOn : '06-Aug-2018',
      reviewedBy : 'Jessica Lara',
      comment : 'Comment'
    }
  ];

  constructor(private activatedRoute: ActivatedRoute,
    private _route:Router,
    private offerDetailViewService: OfferDetailViewService,
    private _location: Location) {
    this.activatedRoute.params.subscribe(params => {
       this.currentOfferId = params['id'];
       this.caseId = params['id2'];
     });
    this.activatedRoute.data.subscribe((data) => {
    console.log(data);
    });
    this.offerOverviewDetailsList = this.activatedRoute.snapshot.data['offerData'];
    console.log(this.offerOverviewDetailsList);
  }

  ngOnInit() {
      this.getOfferOVerviewDetails();
  }

  getOfferOVerviewDetails() {
    this.offerDetailViewService.offerDetailView(this.currentOfferId)
      .subscribe(data => {
        this.offerViewData = data;
        let stakeholdersInfo = null;
        this.offerOwner = data.offerOwner;
        this.offerViewData.stakeholders.forEach(element => {
          stakeholdersInfo = new StakeHolder();
          stakeholdersInfo._id = element._id;
          stakeholdersInfo.offerRole = element.offerRole;
          stakeholdersInfo.email = element.email;
          stakeholdersInfo.functionalRole = element.functionalRole;
          if (element.offerRole === 'coowner') {
            this.offerCoOwnerList.push(stakeholdersInfo);
          } else {
            this.offerStakeHolderList.push(stakeholdersInfo);
          }
        });
      });
  }

  goBack() {
    this._location.back();
  }

  onExportPdf() {
    // this.offerDetailViewService.export().subscribe(data => saveAs(data, `pdf report.pdf`));
  }

}
