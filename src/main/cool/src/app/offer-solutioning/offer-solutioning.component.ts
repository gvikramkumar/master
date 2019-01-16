import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-offer-solutioning',
  templateUrl: './offer-solutioning.component.html',
  styleUrls: ['./offer-solutioning.component.css']
})
export class OfferSolutioningComponent implements OnInit {
  message;
  firstData;
  caseId;
  stakeData;
  totalApprovalsCount;
  approvedCount;
  conditionallyApprovedCount;
  notApprovedCount;
  notReviewedCount;
  strategyReviewList;
  setFlag;
  updateMessage;
  goBack;
  offerDetailOverView;
  updateStakeData;
  


  constructor() { }

  ngOnInit() {
  }

}
