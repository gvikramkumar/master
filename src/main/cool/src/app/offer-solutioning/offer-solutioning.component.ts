import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OffersolutioningService } from '../services/offersolutioning.service';
import { StakeholderfullService } from '../services/stakeholderfull.service';
import { OfferPhaseService } from '../services/offer-phase.service';
import { RightPanelService } from '../services/right-panel.service';
import { ConfigurationService } from '@shared/services';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl, NgForm } from '@angular/forms';

export class OSForm {
  osGroup: OSGroup[];
}

export class OSGroup {
  osGroup = new FormArray([]);
}


@Component({
  selector: 'app-offer-solutioning',
  templateUrl: './offer-solutioning.component.html',
  styleUrls: ['./offer-solutioning.component.css']
})
export class OfferSolutioningComponent implements OnInit {


  caseId: string;
  offerId: string;
  offerName: string;
  offerOwner: string;


  derivedMM: string;
  primaryBE: string;
  primaryPOC: Array<any> = [];
  secondaryPOC: Array<any> = [];

  stake;
  stakeData;
  stakeHolderData;

  mandatoryQuestions = true;
  backbuttonStatusValid = true;
  proceedButtonStatusValid = true;

  displayLeadTime = false;
  noOfWeeksDifference: string;

  message;
  Object = Object;
  offerSolutionData: Object = null;
  offerSolutioningFormGroup: FormGroup;
  groupedQuestionsAndAnswers: Array<any> = [];
  unGroupedQuestionsAndAnswers: Array<any> = [];

  @ViewChild('osForm') osForm: NgForm;


  constructor(private formBuilder: FormBuilder, private router: Router,
    private activatedRoute: ActivatedRoute,
    private offersolutioningService: OffersolutioningService,
    private stakeholderfullService: StakeholderfullService,
    private offerPhaseService: OfferPhaseService,
    private rightPanelService: RightPanelService,
    private configurationService: ConfigurationService) {
    this.activatedRoute.params.subscribe(params => {
      this.offerId = params['id'];
      this.caseId = params['id2'];
    });
  }

  ngOnInit() {

    this.offerSolutioningFormGroup = this.formBuilder.group({
      osGroup: this.formBuilder.array([])
    });

    this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(offerDetails => {

      this.derivedMM = offerDetails['derivedMM'];
      this.offerName = offerDetails['offerName'];
      this.offerOwner = offerDetails['offerOwner'];
      this.stakeHolderData = offerDetails['stakeholders'];

      if (Array.isArray(offerDetails['primaryBEList']) && offerDetails['primaryBEList'].length) {
        this.primaryBE = offerDetails['primaryBEList'][0];
      }

      // TTM Info
      this.rightPanelService.displayAverageWeeks(this.primaryBE, this.derivedMM).subscribe(
        (leadTime) => {
          this.noOfWeeksDifference = Number(leadTime['averageOverall']).toFixed(1);
          this.displayLeadTime = true;
        },
        () => {
          this.noOfWeeksDifference = 'N/A';
        }
      );

      // Populate Stake Holder Info
      this.processStakeHolderInfo();

      // Call /offerDimensions API To Retrieve Offer Solutioning Details
      this.offersolutioningService.getSolutioningPayload(this.offerId).subscribe(data => {
        this.offerSolutionData = data;
        if (this.offerSolutionData !== null && this.offerSolutionData['groups'] != null) {
          this.retrieveSolutioningQuestionAndAnswers();
        }
      });
    });

  }

  // -----------------------------------------------------------------------------------------------------------------------------

  private processStakeHolderInfo() {

    const stakeHolderBasedOnOfferRole = {};
    const stakeHolderBasedOnFunctionalRole = {};

    for (let i = 0; i <= this.stakeHolderData.length - 1; i++) {
      if (stakeHolderBasedOnOfferRole[this.stakeHolderData[i]['offerRole']] == null) {
        stakeHolderBasedOnOfferRole[this.stakeHolderData[i]['offerRole']] = [];
      }
      stakeHolderBasedOnOfferRole[this.stakeHolderData[i]['offerRole']].push({
        userName: this.stakeHolderData[i]['name'],
        emailId: this.stakeHolderData[i]['_id'] + '@cisco.com',
        _id: this.stakeHolderData[i]['_id'],
        businessEntity: this.stakeHolderData[i]['businessEntity'],
        functionalRole: this.stakeHolderData[i]['functionalRole'],
        offerRole: this.stakeHolderData[i]['offerRole'],
        stakeholderDefaults: this.stakeHolderData[i]['stakeholderDefaults']
      });
    }

    for (let i = 0; i <= this.stakeHolderData.length - 1; i++) {
      if (stakeHolderBasedOnFunctionalRole[this.stakeHolderData[i]['functionalRole']] == null) {
        stakeHolderBasedOnFunctionalRole[this.stakeHolderData[i]['functionalRole']] = [];
      }
      stakeHolderBasedOnFunctionalRole[this.stakeHolderData[i]['functionalRole']].push({
        userName: this.stakeHolderData[i]['name'],
        emailId: this.stakeHolderData[i]['_id'] + '@cisco.com',
        _id: this.stakeHolderData[i]['_id'],
        businessEntity: this.stakeHolderData[i]['businessEntity'],
        functionalRole: this.stakeHolderData[i]['functionalRole'],
        offerRole: this.stakeHolderData[i]['offerRole'],
        stakeholderDefaults: this.stakeHolderData[i]['stakeholderDefaults']
      });
    }

    this.stakeData = stakeHolderBasedOnOfferRole;
    this.stake = stakeHolderBasedOnFunctionalRole;

  }

  // -----------------------------------------------------------------------------------------------------------------------------

  private retrieveSolutioningQuestionAndAnswers() {

    const functionalRole = this.configurationService.startupData.functionalRole[0];

    this.offersolutioningService.retrieveOfferSolutionQuestions(this.offerId).subscribe(resQuestionsAndAnswers => {

      // Initialize 'offerQuestionsAndAnswers' Array
      const offerQuestionsAndAnswers = resQuestionsAndAnswers as Array<any>;


      // Retrieve List Of Question and Answers In A List Format From 'offerQuestionsAndAnswers'
      this.unGroupedQuestionsAndAnswers = offerQuestionsAndAnswers.reduce((groupQuestionAccumulator, group) => {

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
      this.unGroupedQuestionsAndAnswers = _.uniqBy(this.unGroupedQuestionsAndAnswers, 'questionNo');

      this.offersolutioningService.retrieveOfferSolutionAnswers(this.offerId).subscribe(resOfferSolutioningAnswers => {

        const offerSolutioningAnswers = resOfferSolutioningAnswers as Array<any>;

        // Initialize QnA Map
        const questionAnswerMap: Map<string, string> = new Map<string, string>();
        for (const qna of offerSolutioningAnswers['questionAnswer']) {
          questionAnswerMap.set(qna['questionNo'], qna['answer']);
        }

        // Populate Answer Field In 'questionsAndAnswers' Array
        for (const qna of this.unGroupedQuestionsAndAnswers) {
          qna['answerToQuestion'] = _.isEmpty(questionAnswerMap.get(qna['questionNo'])) ?
            '' : questionAnswerMap.get(qna['questionNo']);
          qna['answerToQuestion'] = qna['questionType'] === 'Date' ?
            moment(qna['answer']).format('MM/DD/YYYY') : qna['answerToQuestion'];
        }

        // Condtionally Hide Solutioning Question And Answers
        this.unGroupedQuestionsAndAnswers = this.condtionallyHideSolutioningQuestionAndAnswers();

        // Group 'questionsAndAnswers' -> OsGroup -> Group -> SubGroup - In Presence Of Answers
        this.unGroupedQuestionsAndAnswers = this.condtionallyHideSolutioningQuestionAndAnswers();
        this.groupedQuestionsAndAnswers = this.groupSolutioningQuestionAndAnswers(this.unGroupedQuestionsAndAnswers);

        // Create OS Form Group Template
        // const osForm: any = this.createOfferSolutioningFormTemplate();
        // this.offerSolutioningFormGroup = this.formBuilder.group(osForm);

        this.createActionAndNotification();

      }, (err) => {

        // Group 'questionsAndAnswers' -> OsGroup -> Group -> SubGroup - In Absence Of Answers
        if (err && err.status === 404) {

          this.unGroupedQuestionsAndAnswers = this.condtionallyHideSolutioningQuestionAndAnswers();
          this.groupedQuestionsAndAnswers = this.groupSolutioningQuestionAndAnswers(this.unGroupedQuestionsAndAnswers);

          // Create OS Form Group Template
          // const osForm: any = this.createOfferSolutioningFormTemplate();
          // this.offerSolutioningFormGroup = this.formBuilder.group(osForm);

          this.createActionAndNotification();

        }
      });

    });


  }

  private condtionallyHideSolutioningQuestionAndAnswers(): any {

    this.unGroupedQuestionsAndAnswers = this.unGroupedQuestionsAndAnswers.map(childQuestionAndAnswers => {

      if (!_.isEmpty(childQuestionAndAnswers.rules.referenceQ)) {

        const parentQuestionIndex = this.unGroupedQuestionsAndAnswers
          .findIndex(fqa => fqa.questionNo === childQuestionAndAnswers.rules.referenceQ);

        if (parentQuestionIndex === -1) {
          return childQuestionAndAnswers;
        }

        const parentAnswer = this.unGroupedQuestionsAndAnswers[parentQuestionIndex]['answerToQuestion'];
        if (childQuestionAndAnswers.questionType === 'Radio Button' && parentAnswer === 'No') {
          childQuestionAndAnswers.hideQuestion = true;
        } else if (childQuestionAndAnswers.questionType !== 'Radio Button' && _.isEmpty(parentAnswer)) {
          childQuestionAndAnswers.hideQuestion = true;
        }
        return childQuestionAndAnswers;
      } else {
        return childQuestionAndAnswers;
      }

    });

    return this.unGroupedQuestionsAndAnswers;
  }

  private groupSolutioningQuestionAndAnswers(questionsAndAnswers: any): any {
    const groupByOSGroup = _.chain(questionsAndAnswers)
      .groupBy('oSgroup')
      .mapValues(osGroupValues => _.chain(osGroupValues)
        .groupBy('group')
        .mapValues(groupValue => _.chain(groupValue)
          .groupBy('subGroup')
          .mapValues((value, key) => {
            const returnObj = {
              questions: value, subGroupChoicesGiven:
                _.uniq(value.reduce((acc, val) => { acc = acc.concat(val.attribute); return acc; }, [])),
              subGroupChoicesSelected: _.uniq(value
                .reduce((acc, val) => { acc = acc.concat(val.selectedAttributes); return acc; }, []))
            };
            return returnObj;
          }).value())
        .value())
      .value();
    return groupByOSGroup;
  }

  private formatSolutioningQuestionAndAnswers(question: any, functionalRole: string, selectedAttributes: Array<String>) {

    // Initialize Variables
    let validUser = false;

    // Validate Type Of Question Being Asked
    if (!question.questionType) {
      question.questionType = 'Free Text';
    }

    // When Free Text - Restrict Length Of Characters  
    if (question.questionType === 'Free Text') {
      question.rules.maxCharacterLen = _.isEmpty(question.rules.maxCharacterLen) ?
        150 : question.rules.maxCharacterLen;
    }

    // Format Dropdown Display Values
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
      hideQuestion: false,
      validUser: validUser,
      selectedAttributes: selectedAttributes
    };

    // Return New Question Format
    return newQuestionFormat;


  }

  // -----------------------------------------------------------------------------------------------------------------------------

  private createActionAndNotification() {

    const primaryPOC = _.uniq(this.primaryPOC);
    const secondaryPOC = _.uniq(this.secondaryPOC);

    const notificationAssignees = secondaryPOC.reduce((accumulator, functionalRole) => {
      const stakeholderBelongingToTheFunctionalRole = this.stake[functionalRole]
        ? this.stake[functionalRole].map(stakeholder => stakeholder['_id']) : [];
      accumulator = accumulator.concat(stakeholderBelongingToTheFunctionalRole);
      return accumulator;
    }, []);
    const actionAssignees = primaryPOC.reduce((accumulator, functionalRole) => {
      const stakeholderBelongingToTheFunctionalRole = this.stake[functionalRole]
        ? this.stake[functionalRole].map(stakeholder => stakeholder['_id']) : [];
      accumulator = accumulator.concat(stakeholderBelongingToTheFunctionalRole);
      return accumulator;
    }, []);

    let owner = '';
    if (this.stakeData != null && this.stakeData['Owner'] != null && this.stakeData['Owner'].length > 0) {
      owner = this.stakeData['Owner'][0]['_id'];
    }

    this.offersolutioningService.retrieveOfferFlags(this.offerId).subscribe(resOfferStatus => {

      const isSolutioningActionNotificationSent = resOfferStatus && resOfferStatus['solutioningActionNotification'];

      if (!isSolutioningActionNotificationSent) {

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 5);
        const notificationPayload = {
          'offerId': this.offerId,
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
          'offerId': this.offerId,
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
            this.offersolutioningService.updateOfferFlag(this.offerId, 'solutioningActionNotification', true).subscribe();
          });
        });
      }
    });
  }

  private createOfferSolutioningFormTemplate() {

    const osForm: any = {};

    for (const osGroup of Object.keys(this.groupedQuestionsAndAnswers)) {
      osForm[osGroup] = new FormArray([]);
      for (const group of Object.keys(this.groupedQuestionsAndAnswers[osGroup])) {
        osForm[osGroup][group] = new FormArray([]);
        for (const subGroup of Object.keys(this.groupedQuestionsAndAnswers[osGroup][group])) {
          osForm[osGroup][group][subGroup] = new FormArray([]);
          for (const question of Object.keys(this.groupedQuestionsAndAnswers[osGroup][group][subGroup]['questions'])) {
            osForm[osGroup][group][subGroup][question] = new FormGroup({
              questionFreeText: new FormControl(' ', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
              questionRadioButton: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
              questionDropdown: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
              questionDatePicker: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
            });
          }
        }
      }
    }
    return osForm;
  }

  // -----------------------------------------------------------------------------------------------------------------------------

  proceedToOfferComponents(routeTo) {


    // Initialize Variables
    let questionAnswer = [];
    let nextStepPostData = {};
    let miniSolutioningDetails = [];
    nextStepPostData['solutioningDetails'] = [];
    nextStepPostData['offerId'] = this.offerId == null ? '' : this.offerId;

    // Retrieve Solutioning Details - questionAnswer, nextStepPostData
    miniSolutioningDetails = this.populateSolutioningDetails(questionAnswer, nextStepPostData);
    questionAnswer = miniSolutioningDetails['questionAnswer'];
    nextStepPostData = miniSolutioningDetails['nextStepPostData'];

    // Save Offer Solutioning Answers
    const offerSolutioningAnswers = {};
    offerSolutioningAnswers['offerId'] = this.offerId;

    // Filter Values That Have No Data
    questionAnswer = questionAnswer.filter(nonEmptyAnswer => nonEmptyAnswer.answer);
    offerSolutioningAnswers['questionAnswer'] = questionAnswer;

    // Save Offer Solution Answers
    this.offersolutioningService.saveOfferSolutionAnswers(this.offerId, offerSolutioningAnswers).subscribe();

    // Update Offer Details
    this.offersolutioningService.updateOfferDetails(nextStepPostData).subscribe(res => {

      const solutioningProceedPayload = {
        'offerId': this.offerId,
        'taskName': 'Offer Solutioning',
        'caseId': this.caseId,
        'taskId': ''
      };

      // Need to give answer for every question from offer solutioning to enable request approval button.
      let offerSolutioningSelected = true;
      nextStepPostData['solutioningDetails'].forEach(element => {
        element.Details.forEach(ele => {
          if (ele.mandatory && _.isEmpty(JSON.stringify(ele.solutioningAnswer))) {
            offerSolutioningSelected = false;
          }
        });
      });

      if (offerSolutioningSelected) {
        this.mandatoryQuestions = true;
        this.offerPhaseService.createSolutioningActions(solutioningProceedPayload).subscribe(result => {
          if (JSON.parse(routeTo) === true) {
            this.router.navigate(['/offerConstruct', this.offerId, this.caseId]);
          }
        });
      } else {
        this.mandatoryQuestions = false;
      }

    });

  }

  private populateSolutioningDetails(questionAnswer: any[], nextStepPostData: {}) {

    Object.entries(this.groupedQuestionsAndAnswers)
      .forEach(([osGroupKey, osGroupValue]) => {
        Object.entries(this.groupedQuestionsAndAnswers[osGroupKey])
          .forEach(([groupKey, groupValue]) => {
            Object.entries(this.groupedQuestionsAndAnswers[osGroupKey][groupKey])
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
                    'solutioningAnswer': questions.questionType === 'Date' ?
                      questions['answerToQuestion'].toISOString() : questions['answerToQuestion'],
                    'mandatory': questions.rules.isMandatoryOptional === 'Mandatory' ? true : false,
                    'questionType': questions.questionType
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

    const miniSolutioningDetails = [];
    miniSolutioningDetails['questionAnswer'] = questionAnswer;
    miniSolutioningDetails['nextStepPostData'] = nextStepPostData;
    return miniSolutioningDetails;

  }

  // -----------------------------------------------------------------------------------------------------------------------------

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

  // -----------------------------------------------------------------------------------------------------------------------------

}


