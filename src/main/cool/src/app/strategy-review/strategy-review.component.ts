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
import { LeadTime } from '../right-panel/lead-time';
import { RightPanelService } from '../services/right-panel.service';
import { User } from '../access-management/user';
import { AccessManagementService } from '../services/access-management.service';
import { DashboardService } from '../services/dashboard.service';
import { CreateOfferService } from '../services/create-offer.service';
import { element } from '@angular/core/src/render3';


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
  currentFunctionalRole;

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
    private headerService: HeaderService,
    private rightPanelService: RightPanelService,
    private accessManagementService: AccessManagementService,
    private dashboardService: DashboardService,
    private createOfferService: CreateOfferService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
  }

  ngOnInit() {
    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
      this.currentFunctionalRole = data.userMappings[0].functionalRole;
    });
    this.dashboardService.getMyOffersList()
      .subscribe(resOffers => {
        resOffers.forEach(ele => {
          this.stakeHolders[ele.offerId] = {};
          if (ele.stakeholders != null) {
            ele.stakeholders.forEach(holder => {
              if (this.stakeHolders[ele.offerId][holder.functionalRole] == null) {
                this.stakeHolders[ele.offerId][holder.functionalRole] = [];
              }
              this.stakeHolders[ele.offerId][holder.functionalRole].push(holder['_id']);
            });
          }
        });
      });
    this.getStrategyReviwInfo();
    const canEscalateUsers = [];
    const canApproveUsers = [];
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

      let result = data.ideate;

      this.milestoneList = [];
      this.lastValueInMilestone = result.slice(-1)[0];

      let mile = this.lastValueInMilestone
      this.milestoneValue = mile['subMilestone'];
    });

    this.actionsService.getAssignee(this.currentOfferId).subscribe(data => {
      this.assigneeList = data;
    });

    this.stakeholderfullService.getdata(this.currentOfferId).subscribe(data => {
      this.firstData = data;
      this.displayLeadTime = true;
      this.offerId = this.currentOfferId;
      this.data = this.firstData['stakeholders'];
      this.derivedMM = this.firstData['derivedMM'];
      this.offerName = this.firstData['offerName'];
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

      for (const auth in this.stakeData) {
        if (auth === 'Co-Owner' || auth === 'Owner') {
          this.stakeData[auth].forEach(owners => {
            canEscalateUsers.push(owners['_id']);
            canApproveUsers.push(owners['_id']);
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

  getSelectFunctionRole(functionRole) {
    // Reset AssignList and AsigneeValue before service call
    this.assigneeValue = [];
    this.assigneeList = [];
    this.selectedfunctionRole = functionRole;
    if (this.currentOfferId != null && this.selectedfunctionRole != null && this.stakeHolders[this.currentOfferId] != null && this.stakeHolders[this.currentOfferId][this.selectedfunctionRole] != null) {
      this.assigneeList = this.stakeHolders[this.currentOfferId][this.selectedfunctionRole];
    }
  }

  getStrategyReviwInfo() {
    this.strategyReviewService.getStrategyReview(this.caseId).subscribe(resStrategyReview => {
      this.strategyReviewList = resStrategyReview;
      this.totalApprovalsCount = resStrategyReview.length;
      this.approvedCount = resStrategyReview.filter(task => task.status && task.status.toUpperCase() === 'APPROVED').length;
      this.notApprovedCount = resStrategyReview.filter(task => task.status && task.status.toUpperCase() === 'NOT APPROVED').length;
      this.conditionallyApprovedCount = resStrategyReview.filter(task => task.status && task.status.toUpperCase() === 'CONDITIONALLY APPROVED').length;
      this.notReviewedCount = resStrategyReview.filter(task => task.status && task.status.toUpperCase() === 'NOT REVIEWED').length;
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
  gotoOfferviewDetails() {
    this.router.navigate(['/offerDetailView', this.currentOfferId, this.caseId]);
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
      this.router.navigate(['/offerDimension', this.currentOfferId, this.caseId]);
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
    this.commentValue = "";
    this.titleValue = "";
    this.descriptionValue = "";
    this.functionNameValue = "";
    this.assigneeValue = [];
    this.dueDateValue = "";
  }

  createAction() {
    const taskId = this.currentTaskId;
    const userId = this.userService.getUserId();
    const taskName = 'Action';

    const createActionPayload = {};
    createActionPayload['offerName'] = this.offerBuilderdata['offerName'];
    createActionPayload['owner'] = this.offerBuilderdata['offerOwner'];
    createActionPayload['assignee'] = [this.assigneeValue];
    createActionPayload['offerId'] = this.offerId;
    createActionPayload['caseId'] = this.caseId;
    createActionPayload['description'] = this.descriptionValue;
    createActionPayload['actionTitle'] = this.titleValue;
    createActionPayload['dueDate'] = this.dueDateValue.toISOString();
    createActionPayload['mileStone'] = this.milestoneValue;
    createActionPayload['selectedFunction'] = this.functionNameValue;
    createActionPayload['actionCreator'] = userId;
    createActionPayload['type'] = 'Manual Action';

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

    const assignee = [this.assigneeValue];
    const offerId = this.offerId;
    const actionTitle = this.titleValue;
    const actionDescription = this.descriptionValue;

    this.actionsService.createConditionalApprovalAction(createActionPayload).subscribe(response => {
      this.actionsService.createNotAndConditional(createActionComment).subscribe((data) => {
        this.closeForm();
        this.getStrategyReviwInfo();
        this.actionsService.sendNotification(assignee, offerId, actionTitle, actionDescription).subscribe(res => { });
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
      this.commentValue,
      false
    );
    this.actionsService.createActionApprove(createActionApprove).subscribe((data) => {
      this.closeForm();
      this.getStrategyReviwInfo();
    });
    this.createActionApproveForm.reset();
  }

  async onEscalate(functionName: string) {

    // Initialize Variables
    const mailList = [];
    const functionNameMap = this.stakeData[functionName];

    // Iterate - Function Names
    for (const employee of Array.from(functionNameMap.values())) {

      // Compute Manager List
      const userId = employee['_id'];
      const managerDetailsList = await this.accessManagementService.getUserDetails(new User(userId)).toPromise();

      // Iterate - Manager Names
      for (const manager of Array.from(managerDetailsList.values())) {
        mailList.push(manager['manager']);
      }

    }

    // Initialize Email Variables
    const emailPayload = {};
    emailPayload['subject'] = 'Immediate Attention needed! ' + this.currentOfferId + ' + ' + this.offerName + ' Approval pending';
    emailPayload['emailBody'] = 'Hello You are receiving this message because the below offer has a pending approval that requires review from a member of your team. Offer ID: ' + this.currentOfferId + ' Offer Name: ' + this.offerName + ' Your immediate attention is highly appreciated. Thanks';
    emailPayload['toMailLists'] = mailList;

    // Send EMail
    this.actionsService.escalateNotification(emailPayload).subscribe(data => {
      this.getStrategyReviwInfo();
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
