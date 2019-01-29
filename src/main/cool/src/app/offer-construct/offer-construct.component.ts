import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MonetizationModelService } from '../services/monetization-model.service';
import { StakeholderfullService } from '../services/stakeholderfull.service';
import { OfferConstructService } from '../services/offer-construct.service';
import { Groups } from '../models/groups';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-offer-construct',
  templateUrl: './offer-construct.component.html',
  styleUrls: ['./offer-construct.component.css']
})
export class OfferConstructComponent  implements OnInit {
  questionForm: FormGroup;
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
  updateStakeData;
  setFlag;
  derivedMM;
  offerName;
  addDetails;
  hardwareName;
  quesionType;
  @Input() questions: any[] = [];
  payLoad = '';

  public data = [];
  firstData: Object;
  stakeHolderInfo: any;
  backbuttonStatusValid = true;
  proceedButtonStatusValid = true;
  displayAddDetails: Boolean = false;

  constructor(private router: Router,
    private stakeholderfullService: StakeholderfullService,
    private monetizationModelService: MonetizationModelService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private offerConstructService: OfferConstructService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
  }

  ngOnInit() {
    this.questionForm = this.offerConstructService.toFormGroup(this.questions);
    this.data = [];
    this.message = {
      contentHead: 'Great Work!',
      content: 'Offer Construct message.',
      color: 'black'
    };

    this.stakeholderfullService.getdata(this.currentOfferId).subscribe(data => {
      this.firstData = data;
      this.derivedMM = this.firstData['derivedMM'];
      this.data = this.firstData['stakeholders'];
      this.offerName = this.firstData['offerName'];
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
  }

  addItemDetails() {
    console.log('called submit method', this.questionForm);
    this.payLoad = JSON.stringify(this.questionForm.value);
    console.log(this.payLoad);
    this.closeDailog();
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

  closeDailog() {
    this.displayAddDetails = false;
    this.questionForm.reset();
    this.questions = [];
  }

  onHide() {
    this.displayAddDetails = false;
    this.questionForm.reset();
    this.questions = [];
  }

  showAddDetailsDailog(hardware) {
    const hardwareName = hardware;
    this.displayAddDetails = true;
    const groups: Groups[] = [];
    const group = new Groups(
      hardwareName
    );
    groups.push(group);
    console.log(groups);
    const groupsPayload = {groups};
    this.offerConstructService.addDetails(groupsPayload).subscribe((data) => {
    this.addDetails = data;
      console.log(this.addDetails);
      this.addDetails.groups[0].listOfferQuestions.forEach(element => {
        const quesion = element;
        this.questions.push(quesion);
      });
      console.log(this.questions);
    },
      (err) => {
        console.log(err);
      });
  }

  goBack() {
    this.router.navigate(['/strategyReview', this.currentOfferId, this.caseId]);
  }

}
