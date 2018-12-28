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
  offerOwner;
  offerCoOwnerList: StakeHolder[] = [];
  offerStakeHolderList: StakeHolder[] = [];
  stakeName;
  email;
  functionalRole;
  obj = {

  };
  offerOverviewDetailsList = {
      'ideate': [
        {
          'subMilestone': 'Offer Creation',
          'status': 'completed',
          'completionDate': '2018-12-23T19:30:01.000+0000'
        },
        {
          'subMilestone': 'Offer Model Evaluation',
          'status': 'completed',
          'completionDate': '2018-12-23T19:30:01.000+0000'
        },
        {
          'subMilestone': 'Stakeholder Identification',
          'status': 'completed',
          'completionDate': '2018-12-23T19:30:01.000+0000'
        },
        {
          'subMilestone': 'Strategy Review',
          'status': 'completed',
          'completionDate': '2018-12-23T19:30:01.000+0000'
        }
      ],
      'plan' : [
        {
          'subMilestone': 'Offer Dimension Completion',
          'status': 'completed',
          'completionDate': '2018-12-23T19:30:01.000+0000'
        },
        {
          'subMilestone': 'Offer Solutioning',
          'status': 'completed',
          'completionDate': '2018-12-23T19:30:01.000+0000'
        }
      ]
  };

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

  constructor(private activatedRoute: ActivatedRoute, private offerDetailViewService: OfferDetailViewService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
    });
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

  onExportPdf() {
    // this.offerDetailViewService.export().subscribe(data => saveAs(data, `pdf report.pdf`));
  }

}
