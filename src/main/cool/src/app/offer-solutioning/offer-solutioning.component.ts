import { Component, OnInit } from '@angular/core';
import {OfferBasicInfoComponent} from '../offer-basic-info/offer-basic-info.component';
import {MmInfoBarComponent} from '../mm-info-bar/mm-info-bar.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OffersolutioningService } from '../services/offersolutioning.service';
import { StakeholderfullService } from '../services/stakeholderfull.service';

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
  updateMessage;
  goBack;
  offerDetailOverView;
  currentOfferId;
  offerSolutionData:Object = {};
  offerSolutionGroups:Array<any> = [];


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private offersolutioningService: OffersolutioningService,
    private stakeholderfullService: StakeholderfullService) {
      this.activatedRoute.params.subscribe(params => {
        this.currentOfferId = params['id'];
        this.caseId = params['id2']
      });
   }

  ngOnInit() {
    debugger;
    this.offerSolutionData = this.offersolutioningService.getSolutionData(this.currentOfferId);
    if (this.offerSolutionData !== null && this.offerSolutionData['groups'] != null) {
      this.offerSolutionGroups = [];
      this.offerSolutionData['groups'].forEach(group => {
        this.offerSolutionGroups = this.offerSolutionGroups.concat(group['subGroup']);
      });
    }

    this.stakeholderfullService.getdata(this.currentOfferId).subscribe(data => {
      this.firstData = data;
      this.data = this.firstData['stakeholders'];
      this.stakeData = {};
      // this.processStakeHolderData(this.data);
      for (let i = 0; i <= this.data.length - 1; i++) {
        if (this.stakeData[this.data[i]['offerRole']] == null) {
          this.stakeData[this.data[i]['offerRole']] = [];
        }
        this.stakeData[this.data[i]['offerRole']].push(
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
    });
  }

  updateStakeData(data) {

  }
}
