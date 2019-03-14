import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MonetizationModelService } from '@app/services/monetization-model.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { StrategyReviewService } from '@app/services/strategy-review.service';
import { ActionsService } from '@app/services/actions.service';
import { SharedService } from '@app/shared-service.service';
import { Subscription, forkJoin } from 'rxjs';
import { RightPanelService } from '@app/services/right-panel.service';

@Component({
  selector: 'app-designreview',
  templateUrl: './designreview.component.html',
  styleUrls: ['./designreview.component.css']
})
export class DesignReviewComponent implements OnInit {
  offerData: any;
  currentOfferId;
  caseId;
  bviewDeckData: any[];
  choiceSelected;
  groups = {};
  groupKeys = [];
  groupNames = [];
  groupData = [];
  message = {};
  stakeData = {};
  newDataArray = [];
  offerBuilderdata = {};
  updateStakeData;
  setFlag;
  currentUser;
  managerName;
  offerName;

  derivedMM;
  offerId: string;
  primaryBE: string;
  displayLeadTime = false;
  noOfWeeksDifference: string;
  lastValueInMilestone: Array<any>;
  milestone: any;
  selectedfunctionRole: string = null;
  stakeHolders = {};

  public data = [];
  totalApprovalsCount: any = 0;
  approvedCount: any = 0;
  conditionallyApprovedCount: any = 0;
  notApprovedCount: any = 0;
  notReviewedCount: any = 0;
  completeStrategyReviewAvailable: Boolean = false;
  firstData: Object;
  stakeHolderInfo: any;
  subscription: Subscription;
  proceedButtonStatusValid = true;
  backbuttonStatusValid = true;
  milestoneList;
  designReviewList;
  milestoneValue: string;
  proceedToOfferSetup: Boolean = true;

  loadExitCriteria = false;

  constructor(private router: Router,
    private stakeholderfullService: StakeholderfullService,
    private monetizationModelService: MonetizationModelService,
    private activatedRoute: ActivatedRoute,
    private strategyReviewService: StrategyReviewService,
    private actionsService: ActionsService,
    private sharedService: SharedService,
    private rightPanelService: RightPanelService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
  }
  offerDetailOverView(){}
  ngOnInit() {
    forkJoin([this.strategyReviewService.getStrategyReview(this.caseId), this.actionsService.getMilestones(this.caseId)]).subscribe(data => {
      const [designReviewData, milstones] = data;
      this.getDesignReview(designReviewData);
      this.getMilestones(milstones);
      this.completeDesignReview();
    });
    this.data = [];
    this.message = {
      contentHead: 'Great Work!',
      content: 'Design Review Message.',
      color: 'black'
    };
    this.stakeholderfullService.getdata(this.currentOfferId).subscribe(data => {
      this.firstData = data;
      this.offerId = this.currentOfferId;
      this.data = this.firstData['stakeholders'];
      this.derivedMM = this.firstData['derivedMM'];
      this.offerName = this.firstData['offerName'];
      if(Array.isArray(this.firstData['primaryBEList']) && this.firstData['primaryBEList'].length) {
       this.primaryBE = this.firstData['primaryBEList'][0];
      }
      this.rightPanelService.displayAverageWeeks(this.primaryBE, this.derivedMM).subscribe(
        (leadTime) => {
          this.noOfWeeksDifference = Number(leadTime['averageOverall']).toFixed(1);
          this.displayLeadTime = true;
        },
        () => {
          this.noOfWeeksDifference = 'N/A';
        }
      );
      this.stakeHolderInfo = {};
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
    this.monetizationModelService.getAttributes().subscribe(data => {
      this.offerData = data;
      this.offerData['groups'].forEach(group => {
        this.groupNames.push(group['groupName']);
        const curGroup = {};
        group['subGroup'].forEach(g => {
          curGroup[g['subGroupName']] = [];
          g.choices.forEach((c) => {
            curGroup[g['subGroupName']].push({ name: c, type: 0, status: -1 });
          });
        });
        this.groupData.push(curGroup);
      });
    });
    this.getOfferDetails();
  }

  private getMilestones(milestones) {
    const result = milestones.ideate;
    this.milestoneList = [];
    this.lastValueInMilestone = result.slice(-1)[0];
    const mile = this.lastValueInMilestone;
    this.milestoneValue = mile['subMilestone'];
  }

  getOfferDetails() {
    this.offerBuilderdata = {};
    this.monetizationModelService.getOfferBuilderData(this.currentOfferId).subscribe(data => {
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

  getDesignReview(resDesignReview) {
    this.designReviewList = resDesignReview;
    this.totalApprovalsCount = resDesignReview.length;
    this.approvedCount = resDesignReview.filter(task => task.status && task.status.toUpperCase() === 'APPROVED').length;
    this.notApprovedCount = resDesignReview.filter(task => task.status && task.status.toUpperCase() === 'NOT APPROVED').length;
    this.conditionallyApprovedCount = resDesignReview.filter(task => task.status && task.status.toUpperCase() === 'CONDITIONALLY APPROVED').length;
    this.notReviewedCount = resDesignReview.filter(task => task.status && task.status.toUpperCase() === 'NOT REVIEWED').length;
  }

  completeDesignReview() {
    if (this.lastValueInMilestone['status'].toUpperCase() === 'AVAILABLE' &&
      this.totalApprovalsCount > 0 &&
      this.notReviewedCount === 0
    ) {
      const proceedPayload = {
        'taskId': '',
        'userId': this.offerBuilderdata['offerOwner'],
        'caseId': this.caseId,
        'offerId': this.currentOfferId,
        'taskName': 'Design Review',
        'action': '',
        'comment': ''
      };
      return this.sharedService.proceedToNextPhase(proceedPayload).subscribe(result => {
        this.loadExitCriteria = true;
      }, (error) => {
      });
    } else {
      this.loadExitCriteria = true;
    }
  }

  updateMessage(message) {
    if (message != null && message !== '') {
      if (message === 'hold') {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = {
          contentHead: '',
          content: 'The Offer has been placed on hold. All the stakeholders will be notified about the update status of the Offer.',
          color: 'black'
        };
      } else if (message === 'cancel') {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = {
          contentHead: '',
          content: 'The Offer has been cancelled. All the stakeholders will be notified about the update status of the Offer.',
          color: 'black'
        };
      }
    }
  }

  goBack() {
    this.router.navigate(['/offerConstruct', this.currentOfferId, this.caseId]);
  }
  gotoOfferviewDetails() {
    this.router.navigate(['/offerDetailView', this.currentOfferId, this.caseId]);
  }

}
