import { Component, OnInit } from '@angular/core';
import {OfferBasicInfoComponent} from '../offer-basic-info/offer-basic-info.component';
import {MmInfoBarComponent} from '../mm-info-bar/mm-info-bar.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OffersolutioningService } from '../services/offersolutioning.service';
import { StakeholderfullService } from '../services/stakeholderfull.service';
import { OfferPhaseService } from '../services/offer-phase.service';

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
  stake;
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
  stakeFunctionInfo: any;

  derivedMM: any;
  offerId: string;
  primaryBE: string;
  updateStakeData: any;
  proceedButtonStatusValid = true;
  backbuttonStatusValid = true;
  offerName: string;
  offerOwner: string;

  displayLeadTime = false;
  noOfWeeksDifference: string;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private offersolutioningService: OffersolutioningService,
    private stakeholderfullService: StakeholderfullService,
    private offerPhaseService: OfferPhaseService,
    private rightPanelService: RightPanelService) {
      this.activatedRoute.params.subscribe(params => {
        this.currentOfferId = params['id'];
        this.caseId = params['id2'];
      });
   }

  ngOnInit() {
    let that = this;
    this.stakeholderfullService.getdata(this.currentOfferId).subscribe(data => {
      this.firstData = data;
      this.offerName = data['offerName'];
      this.offerOwner = data['offerOwner'];
      this.derivedMM = data['derivedMM'];
      this.displayLeadTime = true;
      this.offerId = this.currentOfferId;
      this.data = this.firstData['stakeholders'];
      this.derivedMM = this.firstData['derivedMM'];
      this.primaryBE = this.firstData['primaryBEList'][0];
      this.rightPanelService.displayLaunchDate(this.offerId).subscribe(
        (leadTime: LeadTime) => {
          this.noOfWeeksDifference = leadTime.noOfWeeksDifference;
        }
      );

      this.stakeHolderInfo = {};
      this.stakeFunctionInfo = {};
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
      for (let i = 0; i <= this.data.length - 1; i++) {
        if (this.stakeFunctionInfo[this.data[i]['functionalRole']] == null) {
          this.stakeFunctionInfo[this.data[i]['functionalRole']] = [];
        }
        this.stakeFunctionInfo[this.data[i]['functionalRole']].push(
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
      this.stake = this.stakeFunctionInfo;


      // if (this.offerSolutionData == null) {
      //   this.offersolutioningService.getSolutioningPayload(this.currentOfferId).subscribe(data => {
      //     this.offerSolutionData = data;
      //     if (this.offerSolutionData !== null && this.offerSolutionData['groups'] != null) {
      //       this.getSolutionGroups();
      //       this.createActionAndNotification();
      //     }
      //   });
      // } else {
      //   if (this.offerSolutionData !== null && this.offerSolutionData['groups'] != null) {
      //     this.getSolutionGroups();
      //     this.createActionAndNotification();
      //   }
      // }

      // this.offerSolutionData = this.offersolutioningService.getSolutionData(this.currentOfferId);
      this.offersolutioningService.getSolutioningPayload(this.currentOfferId).subscribe(data => {
        this.offerSolutionData = data;
        if (this.offerSolutionData !== null && this.offerSolutionData['groups'] != null) {
          this.getSolutionGroups();
          this.createActionAndNotification();
        }
      });
    });
  }

  getSolutionGroups() {
    this.offerSolutionGroups = [];
    this.offerSolutionData['groups'].forEach(group => {
      this.offerSolutionGroups = this.offerSolutionGroups.concat(group['subGroup']);
    });
  }

  createActionAndNotification() {
    let primaryPOC = [];
    let secondaryPOC = [];
    for(let group of this.offerSolutionGroups) {
      if (group['listGrpQuestions'] != null && group['listGrpQuestions'].length > 0) {
        primaryPOC = group['listGrpQuestions'][0]['primaryPOC'];
        secondaryPOC = group['listGrpQuestions'][0]['secondaryPOC'];
        break;
      }
    }
    if (primaryPOC.length > 0) {
      const assignees = [];
      if (primaryPOC != null && primaryPOC.length > 0) {
        primaryPOC.forEach(element => {
          if (this.stake != null && this.stake[element] != null && this.stake[element].length > 0) {
            this.stake[element].forEach(assignee => {
              assignees.push(assignee['_id']);
            });
          }
        });
      }
      const secondassignees = [];
      if (secondaryPOC != null && secondaryPOC.length > 0) {
        secondaryPOC.forEach(element => {
          if (this.stake != null && this.stake[element] != null && this.stake[element].length > 0) {
            this.stake[element].forEach(secondassignee => {
              secondassignees.push(secondassignee['_id']);
            });
          }
        });
      }
      let owner = '';
      if (this.stakeData != null && this.stakeData['Owner'] != null && this.stakeData['Owner'].length > 0) {
        owner = this.stakeData['Owner'][0]['_id'];
      }
      let notificationassignees = assignees.concat(secondassignees);

     
      let dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 5);
      let notificationPayload = {
        "offerId": this.currentOfferId,
        "caseId": this.caseId,
        "actionTitle": "Provide Details",
        "description": "This offer need more information",
        "mileStone": "Offer Solutioning",
        "selectedFunction": primaryPOC !=null ? primaryPOC.join(',') : '' ,
        "assignee": notificationassignees,
        "dueDate": dueDate.toISOString(),
        'offerName': this.offerName,
        "owner": owner,
        "type": "Solutioning Notification",
        };
  
        let actionPayload = {
          '  offerId': this.currentOfferId,
          'caseId': this.caseId,
          'actionTitle': 'Provide Details',
          'description': 'This offer need more information',
          'mileStone': 'Offer Solutioning',
          'selectedFunction': primaryPOC !=null ? primaryPOC.join(',') : '' ,
          'assignee': assignees,
          'dueDate': dueDate.toISOString(),
          'offerName': this.offerName,
          'owner': owner,
          'type': 'Solutioning Action',
          };
        this.offersolutioningService.notificationPost(notificationPayload).subscribe(result => {
          console.log(notificationPayload);
          this.offersolutioningService.actionPost(actionPayload).subscribe(res => {
            console.log(actionPayload);
          })
        });
    }
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

  proceedToNextStep(msg) {
    let nextStepPostData = {};
    nextStepPostData['offerId'] = this.currentOfferId == null ? '' : this.currentOfferId;
    nextStepPostData['offerName'] = this.firstData['offerName'] == null ? '' : this.firstData['offerName'];
    nextStepPostData['offerDesc'] = this.firstData['offerDesc'] == null ? '' : this.firstData['offerDesc'];
    nextStepPostData['offerCreatedBy'] = this.firstData['offerCreatedBy'] == null ? '' : this.firstData['offerCreatedBy'];
    nextStepPostData['offerCreationDate'] = this.firstData['offerCreationDate'] == null ? '' : this.firstData['offerCreationDate'];
    nextStepPostData['offerOwner'] = this.firstData['offerOwner'] == null ? '' : this.firstData['offerOwner'];
    nextStepPostData['clonedOfferId'] = this.firstData['clonedOfferId'] == null ? '' : this.firstData['clonedOfferId'];
    nextStepPostData['primaryBUList'] = this.firstData['primaryBUList'] == null ? '' : this.firstData['primaryBUList'];
    nextStepPostData['primaryBEList'] = this.firstData['primaryBEList'] == null ? '' : this.firstData['primaryBEList'];
    nextStepPostData['strategyReviewDate'] = this.firstData['strategyReviewDate'] == null ? '' : this.firstData['strategyReviewDate'];
    nextStepPostData['designReviewDate'] = this.firstData['designReviewDate'] == null ? '' : this.firstData['designReviewDate'];
    nextStepPostData['readinessReviewDate'] = this.firstData['readinessReviewDate'] == null ? '' : this.firstData['readinessReviewDate'];
  
    nextStepPostData['derivedMM'] = this.derivedMM == null ? '' : this.derivedMM;
    nextStepPostData['overallStatus'] = this.firstData['overallStatus'];
    let stakeHolders = [];
    for (let prop in this.stakeData) {
      this.stakeData[prop].forEach(sh => {
        console.log(sh);
        stakeHolders.push({
          '_id': sh['_id'],
          'businessEntity': sh['businessEntity'],
          'functionalRole': sh['functionalRole'],
          'offerRole': sh['offerRole'],
          'stakeholderDefaults': sh['stakeholderDefaults'],
          'name': sh['userName']
        });
      });
    }
    nextStepPostData['stakeholders'] = stakeHolders;
    nextStepPostData['expectedLaunchDate'] = this.firstData['expectedLaunchDate'];
    nextStepPostData['status'] = {
      'offerPhase': 'PreLaunch',
      'offerMilestone': 'Launch In Progress',
      'phaseMilestone': 'ideate',
      'subMilestone': 'Offer Solutioning'
    };
    nextStepPostData['ideate'] = [{
      'subMilestone': 'Offer Solutioning',
      'status': 'completed',
      'completionDate': new Date().toDateString(),
    }];
    nextStepPostData['secondaryBUList'] = this.firstData['secondaryBUList'];
    nextStepPostData['secondaryBEList'] = this.firstData['secondaryBEList'];
  
    nextStepPostData['solutioningDetails'] = [];
    this.offerSolutionData['groups'].forEach(group => {
      group['subGroup'].forEach(subGroup => {
        let solutioningDetail =  {
          'dimensionGroup': group['groupName'],
          'dimensionSubgroup': subGroup['subGroupName'],
          'dimensionAttribute': subGroup['selected'],
          'primaryFunctions':[],
          'secondaryFunctions':[],
          'Details':[]
        };
        if (subGroup['listGrpQuestions'] != null && subGroup['listGrpQuestions'].length > 0) {
          solutioningDetail['primaryFunctions'] = subGroup['listGrpQuestions'][0]['primaryPOC'];
          solutioningDetail['secondaryFunctions'] = subGroup['listGrpQuestions'][0]['secondaryPOC'];
          subGroup['listGrpQuestions'].forEach(question => {
            let detail = {
              'solutioninQuestion' : question['question'],
              'egenieAttributeName' : question['egineAttribue'],
              'oSGroup' : question['osGroup'],
              'solutioningAnswer': question['answer']
            };
            solutioningDetail['Details'].push(detail);
          });
        }
        nextStepPostData['solutioningDetails'].push(solutioningDetail);
      });
    });
    
    this.offersolutioningService.updateOfferDetails(nextStepPostData).subscribe(res => {
    let solutioningProceedPayload = {
      'taskId': '',
      'userId': this.offerOwner,
      'caseId': this.caseId,
      'offerId': this.currentOfferId,
      'taskName': 'Offer Solutioning',
      'action': '',
      'comment': ''
    };
      this.offerPhaseService.proceedToStakeHolders(solutioningProceedPayload).subscribe(result => {
      this.router.navigate(['/offerConstruct', this.currentOfferId, this.caseId]);
      });

    });

  }
}
