import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MonetizationModelService } from '@app/services/monetization-model.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { ActionsService } from '@app/services/actions.service';
import { SharedService } from '@shared/services/shared/shared-service.service';
import { Subscription, forkJoin } from 'rxjs';
import { RightPanelService } from '@app/services/right-panel.service';
import { MessageService } from '@app/services/message.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgForm } from '@angular/forms';
import { UserService, HeaderService } from '@app/core/services';
import { CreateActionComment } from '@app/models/create-action-comment';
import { CreateActionApprove } from '@app/models/create-action-approve';
import { AccessManagementService } from '@app/services/access-management.service';
import { ExitCriteriaValidationService } from '@app/services/exit-criteria-validation.service';
import { DashboardService, CreateOfferService } from '@shared/services';

@Component({
  selector: 'app-designreview',
  templateUrl: './design-review.component.html',
  styleUrls: ['./design-review.component.css'],
  providers: [SharedService]
})
export class DesignReviewComponent implements OnInit, OnDestroy {

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
  completeStrategyReviewAvailable: Boolean = false;
  firstData: Object;
  stakeHolderInfo: any;
  subscription: Subscription;
  proceedButtonStatusValid = true;
  backbuttonStatusValid = true;
  milestoneList;
  designReviewList;
  milestoneValue: string;
  showButtonSection = false;
  doNotApproveSection = false;
  showConditionalApprovalSection = false;
  escalateVisibleAvailable: Boolean = false;
  showApproveSection = false;
  action: any;
  currentTaskId: any;
  currentStatus: string;
  commentValue: string;
  titleValue: string;
  descriptionValue: string;
  functionNameValue: string;
  assigneeValue: Array<any>;
  dueDateValue: any;
  functionList;
  assigneeList;
  strategyReviewList;
  currentFunctionalRole;
  loadExitCriteria = false;
  strategyReviewComplete: Boolean = false;
  proceedToOfferSetup: Boolean = true;

  constructor(private router: Router,
    private stakeholderfullService: StakeholderfullService,
    private monetizationModelService: MonetizationModelService,
    private activatedRoute: ActivatedRoute,
    private actionsService: ActionsService,
    private sharedService: SharedService,
    private messageService: MessageService,
    private headerService: HeaderService,
    private userService: UserService,
    private accessManagementService: AccessManagementService,
    private rightPanelService: RightPanelService,
    private dashboardService: DashboardService,
    private exitCriteriaValidationService: ExitCriteriaValidationService,
    private createOfferService: CreateOfferService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
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

    forkJoin([this.exitCriteriaValidationService.getDesignReview(this.caseId),
    this.actionsService.getMilestones(this.caseId)]).subscribe(data => {
      const [designReviewData, milstones] = data;
      //Enable offer setup only when Strategy Review is Complete
      milstones['ideate'].forEach(element => {
        if(element['subMilestone'] === 'Strategy Review' && element['status'] === 'Completed'){
          this.strategyReviewComplete = true;
        }
      });
      this.getDesignReview(designReviewData);
      this.getMilestones(milstones);
      this.completeDesignReview();
    });

    const canApproveUsers = [];
    const canEscalateUsers = [];

    this.subscription = this.messageService.getMessage()
      .subscribe(message => {
        this.getDesignReviewInfo();
      });

    this.data = [];
    this.message = {
      contentHead: 'Great Work!',
      content: 'Design Review Message.',
      color: 'black'
    };

    this.showButtonSection = true;
    this.actionsService.getFunction().subscribe(data => {
      this.functionList = data;
    });

    this.actionsService.getAssignee(this.currentOfferId).subscribe(data => {
      this.assigneeList = data;
    });

    this.stakeholderfullService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {
      this.firstData = data;
      this.offerId = this.currentOfferId;
      this.data = this.firstData['stakeholders'];
      this.derivedMM = this.firstData['derivedMM'];
      this.offerName = this.firstData['offerName'];
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
          this.completeStrategyReviewAvailable = true;
        }
        this.headerService.getUserInfo(this.currentUser).subscribe(userData => {
          this.managerName = userData[0].manager;
        });
      });
    });
    this.minDate = new Date();
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });
    this.getOfferDetails();
  }

  // --------------------------------------------------------------------------------------------------------------------------------

  offerSetupView() {

    this.router.navigate(['/offerSetup', this.currentOfferId, this.caseId]);
  }

  private getMilestones(milestones) {
    const result = milestones.plan;
    this.milestoneList = [];
    this.lastValueInMilestone = result.slice(-1)[0];
    const mile = this.lastValueInMilestone;
    this.milestoneValue = mile['subMilestone'];
  }

  getOfferDetails() {
    this.offerBuilderdata = {};
    this.monetizationModelService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {
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

  // --------------------------------------------------------------------------------------------------------------------------------
  // Retrieve Design Review Info
  getDesignReviewInfo() {
    this.exitCriteriaValidationService.getDesignReview(this.caseId).subscribe((resDesignReview) => {
      this.getDesignReview(resDesignReview);
    });
  }

  getDesignReview(resDesignReview) {
    this.designReviewList = resDesignReview;
    this.totalApprovalsCount = resDesignReview.length;
    this.approvedCount = resDesignReview.filter(task => task.status && task.status.toUpperCase() === 'APPROVED').length;
    this.notApprovedCount = resDesignReview.filter(task => task.status && task.status.toUpperCase() === 'NOT APPROVED').length;
    this.conditionallyApprovedCount = resDesignReview.filter(task => task.status &&
      task.status.toUpperCase() === 'CONDITIONALLY APPROVED').length;
    this.notReviewedCount = resDesignReview.filter(task => task.status && task.status.toUpperCase() === 'NOT REVIEWED').length;
  }

  // --------------------------------------------------------------------------------------------------------------------------------

  goBack() {
    this.router.navigate(['/offerConstruct', this.currentOfferId, this.caseId]);
  }

  gotoOfferviewDetails() {
    this.router.navigate(['/offerDetailView', this.currentOfferId, this.caseId]);
  }

  // --------------------------------------------------------------------------------------------------------------------------------

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

  // --------------------------------------------------------------------------------------------------------------------------------

  onTabOpen(taskId, status) {
    this.currentTaskId = taskId;
    this.currentStatus = status;
  }

  // --------------------------------------------------------------------------------------------------------------------------------

  //  function returns flag to display Approval Action section

  getshowApprovalDecisionAction(strategyReviewData) {
    return strategyReviewData.status &&
      strategyReviewData.status.toUpperCase() === 'NOT REVIEWED' &&
      strategyReviewData.assignees.includes(this.userService.getUserId()) &&
      strategyReviewData.function === this.currentFunctionalRole;
  }

  // --------------------------------------------------------------------------------------------------------------------------------

  doNotApprove() {
    this.action = 'Not Approved';
    this.showButtonSection = false;
    this.doNotApproveSection = true;
  }

  conditionalApprove() {
    this.showButtonSection = false;
    this.action = 'Conditionally Approved';
    this.showConditionalApprovalSection = true;

  }

  approve() {
    this.action = 'Approved';
    this.showButtonSection = false;
    this.showApproveSection = true;
  }

  // --------------------------------------------------------------------------------------------------------------------------------

  getSelectFunctionRole(functionRole) {
    // Reset AssignList and AsigneeValue before service call
    this.assigneeList = [];
    this.assigneeValue = [];
    this.selectedfunctionRole = functionRole;
    if (this.currentOfferId != null && this.selectedfunctionRole != null
      && this.stakeHolders[this.currentOfferId] != null && this.stakeHolders[this.currentOfferId][this.selectedfunctionRole] != null) {
      this.assigneeList = this.stakeHolders[this.currentOfferId][this.selectedfunctionRole];
    }
  }

  // --------------------------------------------------------------------------------------------------------------------------------

  closeForm() {
    this.doNotApproveSection = false;
    this.showConditionalApprovalSection = false;
    this.showApproveSection = false;
    this.showButtonSection = true;
    this.commentValue = '';
    this.titleValue = '';
    this.descriptionValue = '';
    this.functionNameValue = '';
    this.assigneeValue = [];
    this.dueDateValue = '';
  }

  createAction() {

    const taskName = 'Action';
    const taskId = this.currentTaskId;
    const userId = this.userService.getUserId();
    const status = this.currentStatus;
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
    createActionPayload['status'] = status;
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
      status
    );

    const offerId = this.offerId;
    const actionTitle = this.titleValue;
    const assignee = [this.assigneeValue];
    const actionDescription = this.descriptionValue;

    this.actionsService.createConditionalApprovalAction(createActionPayload).subscribe(response => {
      this.actionComment(createActionComment, assignee, offerId, actionTitle, actionDescription);
    }, (error) => {
      console.log(error);
      this.actionComment(createActionComment, assignee, offerId, actionTitle, actionDescription);
    });
    this.createActionForm.reset();
  }

  actionComment(createActionComment, assignee, offerId, actionTitle, actionDescription) {
    this.actionsService.createNotAndConditional(createActionComment).subscribe((data) => {
      this.closeForm();
      this.getDesignReviewInfo();
      this.actionsService.sendNotification(assignee, offerId, actionTitle, actionDescription).subscribe(res => { });
    });
  }

  createActionApprove() {

    const taskName = 'Action';
    const taskId = this.currentTaskId;
    const userId = this.userService.getUserId();
    const status = this.currentStatus;
    const createActionApprove: CreateActionApprove = new CreateActionApprove(
      taskId,
      userId,
      taskName,
      this.action,
      this.commentValue,
      false,
      status
    );
    this.actionsService.createActionApprove(createActionApprove).subscribe((data) => {
      this.closeForm();
      this.getDesignReviewInfo();
    });
    this.createActionApproveForm.reset();
  }

  // --------------------------------------------------------------------------------------------------------------------------------

  async onEscalate(element, designReviewData) {
    element.disabled = true;
    // Initialize Variables
    const mailList = [];
    const functionNameMap = this.stakeData[designReviewData["function"]];
    const payload = {};
    // Iterate - Function Names
    for (const employee of Array.from(functionNameMap.values())) {
      // Compute Manager List
      const userId = employee['_id'];
      const managerDetailsList = await this.accessManagementService.getUserDetails(userId.toString()).toPromise();
      // Iterate - Manager Names
      for (const manager of Array.from(managerDetailsList.values())) {
        mailList.push(manager['manager']);
      }
    }
    // Payload for updating Escalation Details
    payload['escalatedBy'] = this.stakeData['Owner'][0]._id;
    payload['escalatedOn'] = designReviewData.assignees;
    payload['escalatedTo'] = mailList;
    payload['taskId'] = designReviewData.taskId;
    payload['caseId'] = this.caseId;
    payload['offerId'] = this.currentOfferId;
    // Initialize Email Variables
    const emailPayload = {};
    emailPayload['toMailLists'] = mailList;
    emailPayload['subject'] = 'Immediate Attention needed! ' + this.currentOfferId + ' + ' + this.offerName + ' Approval pending';
    emailPayload['emailBody'] = 'Hello You are receiving this message because the below offer has a pending approval that requires review from a member of your team. Offer ID: ' + this.currentOfferId + ' Offer Name: ' + this.offerName + ' Your immediate attention is highly appreciated. Thanks';
    //Update Escalation Details
    this.actionsService.updateEscalationDetails(payload).subscribe(data =>{
    });
    // Send EMail
    this.actionsService.escalateNotification(emailPayload).subscribe(data => {
      this.getDesignReviewInfo();
    });
  }

  // --------------------------------------------------------------------------------------------------------------------------------

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

  // --------------------------------------------------------------------------------------------------------------------------------

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // --------------------------------------------------------------------------------------------------------------------------------

}
