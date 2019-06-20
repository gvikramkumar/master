import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MonetizationModelService } from '@app/services/monetization-model.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { OfferPhaseService } from '@app/services/offer-phase.service';
import { MessageService } from '@app/services/message.service';
import { forkJoin, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { OfferconstructCanvasService } from '../offer-construct-canvas/service/offerconstruct-canvas.service';

@Component({
  selector: 'app-offer-construct',
  templateUrl: './offer-construct.component.html',
  styleUrls: ['./offer-construct.component.css']
})
export class OfferConstructComponent implements OnInit, OnDestroy {
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
  constructDetails = [];
  stakeData = {};
  updateStakeData;
  setFlag;
  derivedMM;
  offerName;
  offerOwner: string;
  offerId: string;
  primaryBE: string;
  displayLeadTime = false;
  noOfWeeksDifference: string;
  public data = [];
  firstData: Object;
  stakeHolderInfo: any;
  backbuttonStatusValid = true;
  proceedButtonStatusValid = true;
  subscription: Subscription;
  canMarkComplete: boolean = false;
  markCompleteStatus: boolean;

  constructor(private router: Router,
    private stakeholderfullService: StakeholderfullService,
    private monetizationModelService: MonetizationModelService,
    private activatedRoute: ActivatedRoute,
    private offerPhaseService: OfferPhaseService,
    private messageService: MessageService,
    private rightPanelService: RightPanelService,
    private offerConstructCanvasService: OfferconstructCanvasService) {

    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
    });

    this.subscription = this.offerConstructCanvasService.getMessage().subscribe(constructMessage => {
      this.constructDetails = constructMessage;
    });
  }

  ngOnInit() {
    this.data = [];
    this.message = {
      contentHead: 'Great Work!',
      content: 'Offer Components message.',
      color: 'black'
    };

    this.stakeholderfullService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {
      this.firstData = data;
      this.offerId = this.currentOfferId;
      this.derivedMM = this.firstData['derivedMM'];
      this.data = this.firstData['stakeholders'];
      this.offerName = this.firstData['offerName'];
      this.offerOwner = data['offerOwner'];
      if (Array.isArray(this.firstData['primaryBEList']) && this.firstData['primaryBEList'].length) {
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

    this.monetizationModelService.retrieveOfferDimensionAttributes().subscribe(data => {
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

  // Function to navigate to Offer Detail View
  gotoOfferviewDetails() {
    this.router.navigate(['/offerDetailView', this.currentOfferId, this.caseId]);
  }

  goBack() {
    this.router.navigate(['/offerSolutioning', this.currentOfferId, this.caseId]);
  }

  onProceedToNext(msg) {
    const designReviewProceedPayload = {
      'taskId': '',
      'userId': this.offerOwner,
      'caseId': this.caseId,
      'offerId': this.currentOfferId,
      'taskName': 'Offer Components',
      'action': '',
      'comment': ''
    };

    // Need to drag atlease one major and one minor items from offer component to enable request approval button.
    const majorItemData = [];
    const minorItemData = [];
    if (_.isEmpty(this.constructDetails['message'])) {
      this.messageService.sendMessage('Save Offer Construct Details');
      if (msg !== 'stay_on_this_page') {
        this.router.navigate(['/designReview', this.currentOfferId, this.caseId]);
      }
    } else {
      this.constructDetails['message'].forEach(item => {
        if (item.data.isMajorLineItem === true) {
          majorItemData.push(item);
        }
      });

      this.constructDetails['message'].forEach(minorItem => {
        minorItem['children'].forEach(element => {
          if (element.data.isMajorLineItem === false) {
            minorItemData.push(element);
          }
        });
      });

      this.constructDetails['message'].forEach(majorItem => {
        majorItem['children'].forEach(ele => {
          if (ele.data.isGroupNode) {
            if (ele.children.length > 0) {
              ele.children.forEach(element => {
                minorItemData.push(element);
              });
            }
          }
        });
      });

      if (majorItemData.length > 0 && minorItemData.length > 0) {
        forkJoin([this.offerPhaseService.createSolutioningActions(designReviewProceedPayload)]).subscribe(() => {
          this.messageService.sendMessage('Save Offer Construct Details');
          if (msg !== 'stay_on_this_page') {
            this.router.navigate(['/designReview', this.currentOfferId, this.caseId]);
          }
        });
      } else {
        this.messageService.sendMessage('Save Offer Construct Details');
        if (msg !== 'stay_on_this_page') {
          this.router.navigate(['/designReview', this.currentOfferId, this.caseId]);
        }
      }
    }
  }

  getCanMarkCompleteStatus(status) {

    this.canMarkComplete = status;
 
  }

  getMarkCompleteStatus(status) {
    this.markCompleteStatus = status;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
