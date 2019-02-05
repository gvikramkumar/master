import { Component, OnInit } from '@angular/core';
import {OfferBasicInfoComponent} from '../offer-basic-info/offer-basic-info.component';
import {MmInfoBarComponent} from '../mm-info-bar/mm-info-bar.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OffersolutioningService } from '../services/offersolutioning.service';
import { StakeholderfullService } from '../services/stakeholderfull.service';

import { LeadTime } from '../right-panel/lead-time';
import { RightPanelService } from '../services/right-panel.service';

@Component({
  selector: 'app-offer-solutioning',
  templateUrl: './offer-solutioning.component.html',
  styleUrls: ['./offer-solutioning.component.css']
})
export class OfferSolutioningComponent implements OnInit {
  message;
  firstData;
  data;
  caseId;
  stakeData;
  totalApprovalsCount;
  approvedCount;
  conditionallyApprovedCount;
  notApprovedCount;
  notReviewedCount;
  strategyReviewList;
  setFlag;
  goBack;
  offerDetailOverView;
  currentOfferId;
  offerSolutionData:Object = null;
  offerSolutionGroups:Array<any> = [];
  stakeHolderInfo: any;

  derivedMM: any;
  offerId: string;
  primaryBE: string;
  updateStakeData: any;
  proceedButtonStatusValid = true;
  backbuttonStatusValid = true;
  offerName;


  displayLeadTime = false;
  noOfWeeksDifference: string;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private offersolutioningService: OffersolutioningService,
    private stakeholderfullService: StakeholderfullService,
    private rightPanelService: RightPanelService) {
      this.activatedRoute.params.subscribe(params => {
        this.currentOfferId = params['id'];
        this.caseId = params['id2']
      });
   }

  ngOnInit() {
    this.offerSolutionData = this.offersolutioningService.getSolutionData(this.currentOfferId);
    if (this.offerSolutionData !== null && this.offerSolutionData['groups'] != null) {
      this.offerSolutionGroups = [];
      this.offerSolutionData['groups'].forEach(group => {
        this.offerSolutionGroups = this.offerSolutionGroups.concat(group['subGroup']);
      });
    }

    debugger;
    let that = this;
    this.stakeholderfullService.getdata(this.currentOfferId).subscribe(data => {
      this.firstData = data;
      // get question group data if it's null
      if (this.offerSolutionData == null) {

      }

      this.offerName = this.firstData['offerName'];
      this.derivedMM = this.firstData['derivedMM'];
      this.displayLeadTime = true;
      this.offerId = this.currentOfferId;
      this.data = this.firstData['stakeholders'];
      this.derivedMM = this.firstData['derivedMM'];
      this.primaryBE = this.firstData['primaryBEList'][0];
      this.rightPanelService.displayLaunchDate(this.offerId).subscribe(
        (leadTime: LeadTime) => {
          this.noOfWeeksDifference = leadTime.noOfWeeksDifference + ' Week';
        }
      );

      this.stakeHolderInfo = {};
      // this.processStakeHolderData(this.data);
      for (let i = 0; i <= this.data.length - 1; i++) {
        if (this.stakeHolderInfo[this.data[i]['offerRole']] == null) {
          this.stakeHolderInfo[this.data[i]['offerRole']] = [];
        }
        this.stakeHolderInfo[this.data[i]['offerRole']].push(
          {
            userName: this.data[i]['name'],
            emailId: this.data[i]['_id'] + '@cisco.com',
            _id: this.data[i]['_id'],
            businessEntity: this.data[i]['businessEntity'],
            functionalRole: this.data[i]['functionalRole'],
            offerRole: this.data[i]['offerRole'],
            stakeholderDefaults: this.data[i]['stakeholderDefaults']
          });
      }

      this.stakeData = this.stakeHolderInfo;
    });
  }

  updateMessage(message) {

    if (message != null && message !== '') {
      if (message === 'hold') {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = { contentHead: '', content: 'The Offer has been placed on hold. All the stakeholders will be notified about the update status of the Offer.', color: 'black' };
      } else if (message === 'cancel') {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = { contentHead: '', content: 'The Offer has been cancelled. All the stakeholders will be notified about the update status of the Offer.', color: 'black' };
      }
    }
  }


  processStakeHolderData(stakeHolderData) {
    stakeHolderData.forEach(stakeHolder => {
      if (this.stakeHolderInfo[stakeHolder['offerRole']] == null) {
        this.stakeHolderInfo[stakeHolder['offerRole']] = [];
      }
      this.stakeHolderInfo[stakeHolder['offerRole']].push(
        {
          name: stakeHolder['name'],
          email: stakeHolder['_id'] + '@cisco.com',
          _id: stakeHolder['_id'],
          businessEntity: stakeHolder['businessEntity'],
          functionalRole: stakeHolder['functionalRole'],
          offerRole: stakeHolder['offerRole'],
          stakeholderDefaults: stakeHolder['stakeholderDefaults']
        });
      this.stakeData = this.stakeHolderInfo;
    });
  }

}
