import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OffersolutioningService } from '../services/offersolutioning.service';
import { StakeholderfullService } from '../services/stakeholderfull.service';
import { OfferPhaseService } from '../services/offer-phase.service';
import { RightPanelService } from '../services/right-panel.service';
import { ConfigurationService } from '../services/configuration.service';
import * as _ from 'lodash';
import { concat, filter } from 'rxjs/operators';

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
  primaryPOC: Array<any> = [];
  secondaryPOC: Array<any> = [];
  Object = Object;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private offersolutioningService: OffersolutioningService,
    private stakeholderfullService: StakeholderfullService,
    private offerPhaseService: OfferPhaseService,
    private rightPanelService: RightPanelService,
    private configurationService: ConfigurationService) {
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
      // this.populateInitialQuestion(Object.assign({}, this.firstData['solutioningDetails']));
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

      // Call /offerDimensions API To Retrieve Offer Solutioning Details
      this.offersolutioningService.getSolutioningPayload(this.currentOfferId).subscribe(data => {
        this.offerSolutionData = data;
        if (this.offerSolutionData !== null && this.offerSolutionData['groups'] != null) {
          // this.populateRuleBasedSolutionGroups();
          this.offerSolutionQuestionAndAnswer();
        }
      });
    });

  }

  offerSolutionQuestionAndAnswer() {

    const functionalRole = this.configurationService.startupData.functionalRole;

    this.offersolutioningService.retrieveOfferSolutionQuestions(this.currentOfferId).subscribe(resQuestionsAndAnswers => {

      // Initialize 'offerQuestionsAndAnswers' Array
      const offerQuestionsAndAnswers = resQuestionsAndAnswers as Array<any>;


      // Retrieve List Of Question and Answers In A List Format From 'offerQuestionsAndAnswers'
      let questionsAndAnswers = offerQuestionsAndAnswers.reduce((groupQuestionAccumulator, group) => {

        let osGroupName;
        let selectedAttributes;
        const subgroups = group.subGroup;

        const subgroupQuestions = subgroups.reduce((subGroupQuestionAccumulator, subGroup) => {

          selectedAttributes = subGroup.selected;
          const subGroupQuestions = subGroup.listofQuestions;

          const subGroupOptionalQuestionsist = subGroupQuestions.map((question) => {
            osGroupName = question.oSgroup;
            return this.formatSolutioningQuestionAndAnswers(question, functionalRole, selectedAttributes);
          });

          subGroupQuestionAccumulator = subGroupQuestionAccumulator.concat(subGroupOptionalQuestionsist);
          return subGroupQuestionAccumulator;

        }, []);

        const subGroupAlwaysAskQuestionList = group.listofAlwaysAsk
          .map((question) => {
            return this.formatSolutioningQuestionAndAnswers(question, functionalRole, selectedAttributes);
          });

        groupQuestionAccumulator = groupQuestionAccumulator.concat(subgroupQuestions).concat(subGroupAlwaysAskQuestionList);
        return groupQuestionAccumulator;

      }, []);

      // Retrieve Unique Questions From 'questionsAndAnswers' Array
      questionsAndAnswers = _.uniqBy(questionsAndAnswers, 'question');


      this.offersolutioningService.retrieveOfferSolutionAnswers(this.currentOfferId).subscribe(resOfferSolutioningAnswers => {

        const offerSolutioningAnswers = resOfferSolutioningAnswers as Array<any>;
        // Initialize QnA Map
        const questionAnswerMap: Map<string, string> = new Map<string, string>();
        for (const qna of offerSolutioningAnswers['questionAnswer']) {
          questionAnswerMap.set(qna['questionNo'], qna['answer']);
        }
        // Populate Answer Field In 'questionsAndAnswers' Array
        for (const qna of questionsAndAnswers) {
          qna['answerToQuestion'] = questionAnswerMap.get(qna['questionNo'])
        }
        // Group 'questionsAndAnswers' -> OsGroup -> Group -> SubGroup - In Presence Of Answers
        this.offerSolutionGroups = this.groupQuestionAndAnsers(questionsAndAnswers);
        this.createActionAndNotification();

      }, (err) => {
        // Group 'questionsAndAnswers' -> OsGroup -> Group -> SubGroup - In Absence Of Answers
        if (err && err.status === 404) {
          this.offerSolutionGroups = this.groupQuestionAndAnsers(questionsAndAnswers);
          this.createActionAndNotification();
        }
      });
    });
  }

  private groupQuestionAndAnsers(questionsAndAnswers: any): any {
    const groupByOSGroup = _.chain(questionsAndAnswers)
      .groupBy('oSgroup')
      .mapValues(osGroupValues => _.chain(osGroupValues)
        .groupBy('group')
        .mapValues(groupValue => _.chain(groupValue)
          .groupBy('subGroup')
          .mapValues((value, key) => {
            const returnObj = {
              questions: value,
              subGroupChoicesGiven: value[0].attribute,
              subGroupChoicesSelected: value[0].selectedAttributes
            };
            return returnObj;
          }).value())
        .value())
      .value();
    return groupByOSGroup;
  }

  createActionAndNotification() {
    const primaryPOC = _.uniq(this.primaryPOC);
    const secondaryPOC = _.uniq(this.secondaryPOC);
    const poc = _.uniq([...primaryPOC, ...secondaryPOC]);

    const notificationAssignees = poc.reduce((accumulator, functionalRole) => {
      const stakeholderBelongingToTheFunctionalRole = this.stake[functionalRole] ? this.stake[functionalRole].map(stakeholder => stakeholder['_id']) : [];
      accumulator = accumulator.concat(stakeholderBelongingToTheFunctionalRole);
      return accumulator;
    }, []);
    const actionAssignees = primaryPOC.reduce((accumulator, functionalRole) => {
      const stakeholderBelongingToTheFunctionalRole = this.stake[functionalRole] ? this.stake[functionalRole].map(stakeholder => stakeholder['_id']) : [];
      accumulator = accumulator.concat(stakeholderBelongingToTheFunctionalRole);
      return accumulator;
    }, []);

    let owner = '';
    if (this.stakeData != null && this.stakeData['Owner'] != null && this.stakeData['Owner'].length > 0) {
      owner = this.stakeData['Owner'][0]['_id'];
    }
    this.offersolutioningService.retrieveOfferFlags(this.currentOfferId).subscribe(resOfferStatus => {
      const isSolutioningActionNotificationSent = resOfferStatus && resOfferStatus['solutioningActionNotification'];

      if (!isSolutioningActionNotificationSent) {

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 5);
        const notificationPayload = {
          'offerId': this.currentOfferId,
          'caseId': this.caseId,
          'actionTitle': 'Provide Details',
          'description': 'This offer need more information',
          'mileStone': 'Offer Solutioning',
          'selectedFunction': primaryPOC != null ? primaryPOC.join(',') : '',
          'assignee': notificationAssignees,
          'dueDate': dueDate.toISOString(),
          'offerName': this.offerName,
          'owner': owner,
          'type': 'Solutioning Notification',
        };

        const actionPayload = {
          'offerId': this.currentOfferId,
          'caseId': this.caseId,
          'actionTitle': 'Provide Details',
          'description': 'This offer need more information',
          'mileStone': 'Offer Solutioning',
          'selectedFunction': primaryPOC != null ? primaryPOC.join(',') : '',
          'assignee': actionAssignees,
          'dueDate': dueDate.toISOString(),
          'offerName': this.offerName,
          'owner': owner,
          'type': 'Solutioning Action',
        };

        this.offersolutioningService.notificationPost(notificationPayload).subscribe(result => {
          this.offersolutioningService.actionPost(actionPayload).subscribe(res => {
            this.offersolutioningService.updateOfferFlag(this.currentOfferId, 'solutioningActionNotification', true).subscribe()
          });
        });

      }

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

  proceedToNextStep(msg) {


    // --------------------

    const nextStepPostData = {};
    nextStepPostData['solutioningDetails'] = [];
    nextStepPostData['offerId'] = this.currentOfferId == null ? '' : this.currentOfferId;



    // ----------------------

    // Iterate - Function Names
    let questionAnswer = [];
    Object.entries(this.offerSolutionGroups)
      .forEach(([osGroupKey, osGroupValue]) => {

        Object.entries(this.offerSolutionGroups[osGroupKey])
          .forEach(([groupKey, groupValue]) => {

            Object.entries(this.offerSolutionGroups[osGroupKey][groupKey])
              .forEach(([subGroupKey, subGroupValue]) => {


                const solutioningDetail = {
                  'dimensionGroup': groupKey,
                  'dimensionSubgroup': subGroupKey,
                  'dimensionAttribute': subGroupValue['subGroupChoicesSelected'],
                  'primaryFunctions': [],
                  'secondaryFunctions': [],
                  'Details': []
                };

                const answerList = subGroupValue['questions'].map(questions => {

                  const [questionSource, attributeName] = questions['source'] ? questions['source'].split('~~') : ['', ''];

                  const offerQuestion = {
                    'solutioninQuestion': questions['question'],
                    'egenieAttributeName': attributeName ? attributeName : '',
                    'oSGroup': questions['oSgroup'],
                    'solutioningAnswer': questions['answerToQuestion']
                  };
                  solutioningDetail['Details'].push(offerQuestion);

                  return {
                    'questionNo': questions.questionNo,
                    'answer': questions.answerToQuestion
                  };
                });

                questionAnswer = questionAnswer.concat(answerList);
                nextStepPostData['solutioningDetails'].push(solutioningDetail);

              });
          });

      });


    // Save Offer Solutioning Answers
    const offerSolutioningAnswers = {};
    offerSolutioningAnswers['offerId'] = this.offerId;

    // Filter Values That Have No Data
    questionAnswer = questionAnswer.filter(nonEmptyAnswer => nonEmptyAnswer.answer);
    offerSolutioningAnswers['questionAnswer'] = questionAnswer;

    this.offersolutioningService.saveOfferSolutionAnswers(this.currentOfferId, offerSolutioningAnswers).subscribe();


    // ---------------------

    // Update Offer Details

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
  formatSolutioningQuestionAndAnswers(question: any, functionalRole: string, selectedAttributes: Array<String>) {

    // Initialize Variables
    let validUser = false;

    // Validate Type Of Question Being Asked
    if (!question.questionType) {
      question.questionType = 'Free Text';
    }

    if (question.questionType === 'dropdown') {
      question.values = question.values.map(drpValue => {
        const [value, display] = drpValue.split('~~');
        return {
          value: value,
          display: display ? display : value
        };
      });
    }

    // Validate If User Can Edit Questions Based On His Functional Role
    if (question.primaryPOC || question.secondaryPOC) {
      if (question.primaryPOC.includes(functionalRole) || (question.secondaryPOC.includes(functionalRole))) {
        validUser = true;
      }
    }

    // Populate primary and secondary POC 
    this.primaryPOC = question ? [...this.primaryPOC, ...question.primaryPOC] : [...this.primaryPOC];
    this.secondaryPOC = question ? [...this.secondaryPOC, ...question.secondaryPOC] : [...this.secondaryPOC];

    // Map Values Into New Format
    const newQuestionFormat = {
      ...question,
      validUser: validUser,
      selectedAttributes: selectedAttributes
    };

    // Return New Question Format
    return newQuestionFormat;

  }
}



