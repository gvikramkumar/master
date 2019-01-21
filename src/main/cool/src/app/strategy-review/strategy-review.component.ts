import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MonetizationModelService } from '../services/monetization-model.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Location } from '@angular/common';
import { StakeholderfullService } from '../services/stakeholderfull.service';
import { StrategyReviewService } from '../services/strategy-review.service';
import { NgForm } from '@angular/forms';
import { ActionsService } from '../services/actions.service';
import { CreateActionComment } from '../models/create-action-comment';
import { CreateActionApprove } from '../models/create-action-approve';
import { UserService } from '../services/user.service';
import { SharedService } from '../shared-service.service';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs';
import { HeaderService } from '../header/header.service';

@Component({
  selector: 'app-strategy-review',
  templateUrl: './strategy-review.component.html',
  styleUrls: ['./strategy-review.component.css']
})
export class StrategyReviewComponent implements OnInit, OnDestroy {
  @ViewChild('createActionForm') createActionForm: NgForm;
  @ViewChild('createActionApproveForm') createActionApproveForm: NgForm;
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
  minDate: Date;
  updateStakeData;
  setFlag;
  derivedMM;
  currentUser;
  managerName;
  offerName;

  public data = [];
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  totalApprovalsCount: any = 0;
  approvedCount: any = 0;
  conditionallyApprovedCount: any = 0;
  notApprovedCount: any = 0;
  notReviewedCount: any = 0;
  showButtonSection = false;
  doNotApproveSection = false;
  showConditionalApprovalSection = false;
  escalateVisibleAvailable: Boolean = false;
  showApproveSection = false;
  action: any;
  currentTaskId: any;
  commentValue: string;
  titleValue: string;
  descriptionValue: string;
  milestoneValue: string;
  functionNameValue: string;
  assigneeValue: Array<any>;
  dueDateValue: any;
  functionList;
  assigneeList;
  milestoneList;
  strategyReviewList;
  firstData: Object;
  stakeHolderInfo: any;
  subscription: Subscription;
  proceedButtonStatusValid = true;
  backbuttonStatusValid = true;

  constructor(private router: Router,
    private stakeholderfullService: StakeholderfullService,
    private monetizationModelService: MonetizationModelService,
    private activatedRoute: ActivatedRoute,
    private strategyReviewService: StrategyReviewService,
    private actionsService: ActionsService,
    private userService: UserService,
    private _location: Location,
    private sharedService: SharedService,
    private messageService: MessageService,
    private headerService: HeaderService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
  }

  ngOnInit() {
    const canEscalateUsers = [];
    this.subscription = this.messageService.getMessage()
      .subscribe(message => {
        this.getStrategyReviwInfo();
      });

    this.data = [];
    this.message = {
      contentHead: 'Great Work!',
      content: 'Strategy review message.',
      color: 'black'
    };
    this.showButtonSection = true;
    this.actionsService.getFunction().subscribe(data => {
      this.functionList = data;
    });

    this.actionsService.getMilestones(this.caseId).subscribe(data => {
      this.milestoneList = [];
      for (const milestone in data) {
        if (data) {
          data[milestone].forEach(element => {
            this.milestoneList.push(element);
          });
        }
      }
    });

    this.actionsService.getAssignee(this.currentOfferId).subscribe(data => {
      this.assigneeList = data;
    });

    this.stakeholderfullService.getdata(this.currentOfferId).subscribe(data => {
      this.firstData = data;
      this.derivedMM = this.firstData['derivedMM'];
      this.data = this.firstData['stakeholders'];
      this.offerName = this.firstData['offerName'];
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

      for (const auth in this.stakeData) {
        if (auth === 'Co-Owner' || auth === 'Owner') {
          this.stakeData[auth].forEach(owners => {
            canEscalateUsers.push(owners['_id']);
          });
        }
      }
      this.headerService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
        if (canEscalateUsers.includes(user)) {
          this.escalateVisibleAvailable = true;
        }
        this.headerService.getUserInfo(this.currentUser).subscribe(userData => {
          this.managerName = userData[0].manager;
        });
      });
    });
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });
    this.minDate = new Date();
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

  getStrategyReviwInfo() {
    this.strategyReviewService.getStrategyReview(this.caseId).subscribe(data => {
      this.strategyReviewList = data;
      this.totalApprovalsCount = this.strategyReviewList.length;
      this.strategyReviewList.forEach(element => {
        if (element.status && element.status.toLowerCase() === 'approved') {
          this.approvedCount = this.approvedCount + 1;
        } else if (element.status && element.status.toLowerCase() === 'not approved') {
          this.notApprovedCount = this.notApprovedCount + 1;
        } else if (element.status && element.status.toLowerCase() === 'conditionally approved') {
          this.conditionallyApprovedCount = this.conditionallyApprovedCount + 1;
        } else if (element.status && element.status.toLowerCase() === 'not reviewed') {
          this.notReviewedCount = this.notReviewedCount + 1;
        }
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

  goBack() {
    // this._location.back();
    // this.router.navigate(['/stakeholderFull',this.currentOfferId]);
    this.router.navigate(['/stakeholderFull', this.currentOfferId, this.caseId]);
  }


  offerDetailOverView() {
    const proceedPayload = {
      'taskId': '',
      'userId': this.offerBuilderdata['offerOwner'],
      'caseId': this.caseId,
      'offerId': this.currentOfferId,
      'taskName': 'Strategy Review',
      'action': '',
      'comment': ''
    };
    this.sharedService.proceedToNextPhase(proceedPayload).subscribe(result => {
      this.router.navigate(['/offerDetailView', this.currentOfferId, this.caseId]);
    }, (error) => {
    });
  }

  onTabOpen(taskId) {
    this.currentTaskId = taskId;
  }

  doNotApprove() {
    this.doNotApproveSection = true;
    this.action = 'Not Approved';
    this.showButtonSection = false;
  }

  conditionalApprove() {
    this.showConditionalApprovalSection = true;
    this.action = 'Conditionally Approved';
    this.showButtonSection = false;
  }

  approve() {
    this.showApproveSection = true;
    this.action = 'Approved';
    this.showButtonSection = false;
  }

  closeForm() {
    this.doNotApproveSection = false;
    this.showConditionalApprovalSection = false;
    this.showApproveSection = false;
    this.showButtonSection = true;
  }

  createAction() {
    const taskId = this.currentTaskId;
    const userId = this.userService.getUserId();
    const taskName = 'Action';
    const createActionPayload = {};
    createActionPayload['offerName'] = this.offerBuilderdata['offerName'];
    createActionPayload['owner'] = this.assigneeValue;
    const createActionComment: CreateActionComment = new CreateActionComment(
      taskId,
      userId,
      taskName,
      this.action,
      this.commentValue,
      this.titleValue,
      this.descriptionValue,
      this.milestoneValue,
      this.functionNameValue,
      this.assigneeValue,
      this.dueDateValue.toISOString(),
    );
    this.actionsService.createNotAndConditional(createActionComment).subscribe((data) => {
      this.actionsService.postForNewAction(this.currentOfferId, this.caseId, createActionPayload).subscribe(response => {
        this.closeForm();
        this.getStrategyReviwInfo();
      });
    });
    this.createActionForm.reset();
  }

  createActionApprove() {
    const taskId = this.currentTaskId;
    const userId = this.userService.getUserId();
    const taskName = 'Action';
    const createActionApprove: CreateActionApprove = new CreateActionApprove(
      taskId,
      userId,
      taskName,
      this.action,
      this.commentValue
    );
    this.actionsService.createActionApprove(createActionApprove).subscribe((data) => {
      this.closeForm();
      this.getStrategyReviwInfo();
    });
    this.createActionApproveForm.reset();
  }

  onEscalate() {
    const mailList = [this.managerName];
    const emailPayload = {};
    emailPayload['subject'] = 'Immediate Attention needed! ' + this.currentOfferId + ' + ' + this.offerName + ' Approval pending';
    emailPayload['emailBody'] = 'Hello You are receiving this message because the below offer has a pending approval that requires review from a member of your team. Offer ID: ' + this.currentOfferId + ' Offer Name: ' + this.offerName + ' Your immediate attention is highly appreciated. Thanks';
    emailPayload['toMailLists'] = mailList;
    this.actionsService.escalateNotification(emailPayload).subscribe(data => {
      this.getStrategyReviwInfo();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
