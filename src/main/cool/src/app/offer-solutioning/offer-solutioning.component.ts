import { Component, OnInit } from '@angular/core';
import { OfferBasicInfoComponent } from '../offer-basic-info/offer-basic-info.component';
import { MmInfoBarComponent } from '../mm-info-bar/mm-info-bar.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OffersolutioningService } from '../services/offersolutioning.service';
import { StakeholderfullService } from '../services/stakeholderfull.service';
import { OfferPhaseService } from '../services/offer-phase.service';

import { LeadTime } from '../right-panel/lead-time';
import { RightPanelService } from '../services/right-panel.service';
import * as _ from 'lodash';
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
  offerSolutionData: Object = null;
  offerSolutionGroups: Array<any> = [];
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
  // initialOfferSolutioning;
  initialSolutioningGroups;
  Object = Object;

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

    this.stakeholderfullService.getdata(this.currentOfferId).subscribe(data => {

      this.firstData = data;
      this.offerName = data['offerName'];
      this.offerOwner = data['offerOwner'];
      this.derivedMM = data['derivedMM'];
      this.offerId = this.currentOfferId;
      this.data = this.firstData['stakeholders'];
      this.derivedMM = this.firstData['derivedMM'];
      this.populateInitialQuestion(Object.assign({}, this.firstData['solutioningDetails']));
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
      this.stakeFunctionInfo = {};

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

      this.offersolutioningService.getSolutioningPayload(this.currentOfferId).subscribe(data => {
        this.offerSolutionData = data;
        if (this.offerSolutionData !== null && this.offerSolutionData['groups'] != null) {
          this.populateRuleBasedSolutionGroups();
          this.createActionAndNotification();
        }
      });
    });
  }

  populateInitialQuestion(initialOfferSolutioning: Array<any>) {

    this.initialSolutioningGroups = _.chain(initialOfferSolutioning)
      .groupBy('dimensionGroup')
      .mapValues(groupValue => _.chain(groupValue)
        .groupBy('dimensionSubgroup')
        .mapValues((value, key) => {
          const returnObj = {
            questions: value.reduce((acc, val) => {
              acc = acc.concat(val.Details);
              return acc;
            }, [])
          };
          return returnObj;
        })
        .value()
      )
      .value();


  }

  populateRuleBasedSolutionGroups() {

    const arrOfferSolution = this.offerSolutionData['groups'] as Array<any>;

    const questionsAndAnswers = arrOfferSolution.reduce((groupAccumulator, group) => {

      const groupName = group.groupName;
      const subgroups = group.subGroup;

      const subgroupQuestions = subgroups.reduce((subgroupAccumulator, subgroup) => {

        const subgroupName = subgroup.subGroupName;
        const questions = subgroup.listGrpQuestions;
        const subGroupQuestions = _.uniqBy(questions.map(question => {

          question.groupName = groupName;
          question.subGroupName = subgroupName;
          question.subGroupChoicesGiven = subgroup.choices;
          question.subGroupChoicesSelected = subgroup.selected;

          const offerQuestions = this.initialSolutioningGroups[groupName][subgroupName].questions;
          const offerQuestion = _.filter(offerQuestions, q => q.solutioninQuestion === question.question);
          question.answer = offerQuestion && offerQuestion.length > 0 ? offerQuestion[0].solutioningAnswer : '';
          return question;

        }), (q) => q.question);

        subgroupAccumulator = subgroupAccumulator.concat(subGroupQuestions);
        return subgroupAccumulator;

      }, []);

      groupAccumulator = groupAccumulator.concat(subgroupQuestions);
      return groupAccumulator;
    }, []);

    const groupByOSGroup = _.chain(questionsAndAnswers)
      .groupBy('osGroup')
      .mapValues(osGroupValues => _.chain(osGroupValues)
        .groupBy('groupName')
        .mapValues(groupValue => _.chain(groupValue)
          .groupBy('subGroupName')
          .mapValues((value, key) => {
            const returnObj = {
              questions: value,
              subGroupChoicesGiven: value[0].subGroupChoicesGiven,
              subGroupChoicesSelected: value[0].subGroupChoicesSelected
            };
            return returnObj;
          }).value())
        .value())
      .value();

    this.offerSolutionGroups = groupByOSGroup;

  }


  createActionAndNotification() {
    let primaryPOC = [];
    let secondaryPOC = [];
    for (let group of this.offerSolutionGroups) {
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
        "selectedFunction": primaryPOC != null ? primaryPOC.join(',') : '',
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
        'selectedFunction': primaryPOC != null ? primaryPOC.join(',') : '',
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

    debugger;
    const nextStepPostData = {};
    nextStepPostData['offerId'] = this.currentOfferId == null ? '' : this.currentOfferId;

    nextStepPostData['solutioningDetails'] = [];
    this.offerSolutionData['groups'].forEach(group => {
      group['subGroup'].forEach(subGroup => {
        const solutioningDetail = {
          'dimensionGroup': group['groupName'],
          'dimensionSubgroup': subGroup['subGroupName'],
          'dimensionAttribute': subGroup['selected'],
          'primaryFunctions': [],
          'secondaryFunctions': [],
          'Details': []
        };
        if (subGroup['listGrpQuestions'] != null && subGroup['listGrpQuestions'].length > 0) {
          solutioningDetail['primaryFunctions'] = subGroup['listGrpQuestions'][0]['primaryPOC'];
          solutioningDetail['secondaryFunctions'] = subGroup['listGrpQuestions'][0]['secondaryPOC'];
          subGroup['listGrpQuestions'].forEach(question => {
            const detail = {
              'solutioninQuestion': question['question'],
              'egenieAttributeName': question['egineAttribue'],
              'oSGroup': question['osGroup'],
              'solutioningAnswer': question['answer']
            };
            solutioningDetail['Details'].push(detail);
          });
        }
        nextStepPostData['solutioningDetails'].push(solutioningDetail);
      });
    });

    this.offersolutioningService.updateOfferDetails(nextStepPostData).subscribe(res => {
      const solutioningProceedPayload = {
        'taskId': '',
        'userId': this.offerOwner,
        'caseId': this.caseId,
        'offerId': this.currentOfferId,
        'taskName': 'Offer Solutioning',
        'action': '',
        'comment': ''
      };
      this.offerPhaseService.proceedToStakeHolders(solutioningProceedPayload).subscribe(result => {
        if (msg !== 'stay_on_this_page') {

          this.router.navigate(['/offerConstruct', this.currentOfferId, this.caseId]);
        }
      });

    });

  }
}