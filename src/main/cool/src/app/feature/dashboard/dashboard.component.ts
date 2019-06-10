import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ActionsService } from '@app/services/actions.service';
import { CreateActionApprove } from '@app/models/create-action-approve';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { lifeCycleStatusEnum } from '@shared/enums';
import { DashboardService, CreateOfferService } from '@shared/services';
import { UserService } from '@app/core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService, MessageService, ConfirmationService]
})
export class DashboardComponent implements OnInit {

  @ViewChild('createActionForm') createActionForm: NgForm;
  @ViewChild('createActionApproveForm') createActionApproveForm: NgForm;

  myActionsAndNotifications = [];
  myOffers;
  actionCount = {
    pendingActionCount: 0,
    needImmediateActionCount: 0
  }

  showDoNotApproveSection = false;
  showConditionalApprovalSection = false;
  showApproveSection = false;
  showActionSection = true;
  showProvideDetailsPopUp = false;

  minDate = new Date();
  offerColumns: any[];
  myActionColumns: any[];
  commentValue: string;
  titleValue: string;
  descriptionValue: string;
  milestoneValue: string;
  functionNameValue: string;
  assigneeValue: Array<any>;
  dueDateValue: any;

  functionList;
  assigneeList;
  milestoneList = [];
  action: any;

  selectedNotification;
  selectedAction;
  commentEvent: any;
  selectedActionData: any;
  selectedfunctionRole: string = null;
  stakeHolders = {};
  selectedofferId: string = null;
  selectedCaseId: string = null;
  lastValueInMilestone: Array<any>;
  val: any;
  buttonIsDisabled: boolean = false;
  reason: string = '';
  fileToUpload: File = null;
  selectedFile: any;



  constructor(private dashboardService: DashboardService,
    private router: Router,
    private userService: UserService,
    private actionsService: ActionsService,
    private createOfferService: CreateOfferService,
  ) {
  }

  ngOnInit() {


    this.offerColumns = [
      { field: 'offerId', header: 'OFFER ID' },
      { field: 'offerName', header: 'OFFER NAME' },
      { field: 'ownerName', header: 'OFFER OWNER' },
      { field: 'expectedLaunchDate', header: 'LAUNCH DATE' },
      { field: 'lifeCyclePriority', header: 'LIFE CYCLE STATUS' }
    ];

    this.myActionColumns = [
      { field: 'offerId', header: 'OFFER ID' },
      { field: 'title', header: 'ACTIONS AND NOTIFICATIONS'},
      { field: 'offerName', header: 'OFFER NAME' },
      { field: 'titleDesc', hidden: true },
      { field: 'offerOwner', header: 'OFFER OWNER' },
      { field: 'status', header: 'STATUS'},
      { field: 'triggerDate', header: 'TRIGGER DATE' },
      { field: 'dueDate', header: 'DUE DATE' },
    ]
    this.getMyActionsAndNotifications();
    this.getMyOffers();
    this.getFunctions();

  }




  private getMyActionsAndNotifications() {

    this.dashboardService.getMyActionsList()
      .subscribe(resActionsAndNotifications => {
        let actions = [];
        let notifications = [];
        if (resActionsAndNotifications && resActionsAndNotifications.actionList) {
          actions = this.processActions(resActionsAndNotifications.actionList);
          
          this.actionCount.pendingActionCount = resActionsAndNotifications.pendingTasksCount;
          this.actionCount.needImmediateActionCount = resActionsAndNotifications.immediateTasksCount;
        }
        if (resActionsAndNotifications && resActionsAndNotifications.notificationList) {
          notifications = this.processNotifications(resActionsAndNotifications.notificationList);
        }
        this.myActionsAndNotifications = [...actions, ...notifications];
      });
  }

  private processNotifications(notifications: any) {
    return notifications.map(notification => {
      notification.alertType = 'notification';
      notification.title = notification.notifcationTitle;
      notification.desc = notification.notificationDesc;
      notification.dueDate = this.dateFormat(notification.dueDate);
      notification.triggerDate = this.dateFormat(notification.triggerDate);
      // notification.assigneeId = notification.offerOwner ? notification.assigneeId.split(',').join(', ') : '';

      return notification;
    });
  }

  private processActions(actions: any) {
    return actions.map(action => {
      //this.processActionCount(action);
      action.alertType = 'action';
      action.title = action.actionTitle;
      action.desc = action.actionDesc;
      action.dueDate = this.dateFormat(action.dueDate);
      action.triggerDate = this.dateFormat(action.triggerDate);
      // action.assigneeId = action.assigneeId ? action.assigneeId.split(',').join(', ') : '';

      return action;
    });
  }

  dateFormat(inputDate: string) {
    return moment(inputDate).format('DD-MMM-YYYY');
  }
  
  private addLifeCycleSortingColumn(resOffers) {

    this.myOffers = resOffers.map((data) => {

      let priority = 0;
      switch (data.status.offerMilestone) {
        case lifeCycleStatusEnum.INLAUNCH.value:
          priority = lifeCycleStatusEnum.INLAUNCH.priority;
          break;
        case lifeCycleStatusEnum.CANCEL.value:
          priority = lifeCycleStatusEnum.CANCEL.priority;
          break;
        case lifeCycleStatusEnum.ONHOLD.value:
          priority = lifeCycleStatusEnum.ONHOLD.priority;
          break;
      }
      return { ...data, 'lifeCyclePriority': priority };
    });
  }
  private getMyOffers() {
    this.dashboardService.getMyOffersList()
      .subscribe(resOffers => {
        this.addLifeCycleSortingColumn(resOffers);
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
  }

  private getFunctions() {
    this.actionsService.getFunction().subscribe(data => {
      this.functionList = data;
    });
  }

  showActionPopUp(event, action, overlaypanel: OverlayPanel) {
    this.commentEvent = event;
    this.selectedAction = action;
    this.showActionSection = true;
    this.showDoNotApproveSection = false;
    this.showConditionalApprovalSection = false;
    this.showApproveSection = false;
    overlaypanel.toggle(event);
  }


  getActionFormValues() {
    this.selectedofferId = this.selectedAction.offerId;
    this.selectedCaseId = this.selectedAction.caseId;
    this.actionsService.getActionDetails(this.selectedAction.taskId)
    .subscribe(data => {
      this.selectedAction.milestone = data.milestone;
    });
    this.milestoneValue = this.selectedAction.milestone;
    if (this.selectedofferId != null && this.selectedfunctionRole != null
      && this.stakeHolders[this.selectedofferId] != null
      && this.stakeHolders[this.selectedofferId][this.selectedfunctionRole] != null) {
      this.assigneeList = this.stakeHolders[this.selectedofferId][this.selectedfunctionRole];
    } else {
      this.assigneeList = [];
    }
  }

  getSelectFunctionRole(functionRole) {
    // Reset AssignList and AsigneeValue before service call
    this.assigneeValue = [];
    this.assigneeList = [];
    this.selectedfunctionRole = functionRole;
    if (this.selectedofferId != null && this.selectedfunctionRole != null
      && this.stakeHolders[this.selectedofferId] != null
      && this.stakeHolders[this.selectedofferId][this.selectedfunctionRole] != null) {
      this.assigneeList = this.stakeHolders[this.selectedofferId][this.selectedfunctionRole];
    } else {
      this.assigneeList = [];
    }
  }

  manualActioncomplete() {

  }

  doNotApprove() {
    // this.showActionSection = false;
    this.showDoNotApproveSection = true;
    this.action = 'not approved';
    this.showActionSection = false;
    
  }

  conditionalApprove() {
    // this.showActionSection = false;
    this.showConditionalApprovalSection = true;
    this.action = 'conditionally Approved';
    this.showActionSection = false;
  }

  approve() {
    // this.showActionSection = false;
    this.showApproveSection = true;
    this.action = 'approved';
    this.showActionSection = false;
  }

  createNotAndConditionalAction(overlaypanel: OverlayPanel) {
    const createActionPayload = {};
    createActionPayload['offerName'] = this.selectedAction.offerName;
    createActionPayload['owner'] = this.selectedAction.offerOwner;
    createActionPayload['assignee'] = [this.assigneeValue];
    createActionPayload['offerId'] = this.selectedAction.offerId;
    createActionPayload['caseId'] = this.selectedAction.caseId;
    createActionPayload['description'] = this.descriptionValue;
    createActionPayload['actionTitle'] = this.titleValue;
    createActionPayload['dueDate'] = this.dueDateValue.toISOString();
    createActionPayload['mileStone'] = this.milestoneValue;
    createActionPayload['selectedFunction'] = this.functionNameValue;
    createActionPayload['actionCreator'] = this.userService.getUserId();
    createActionPayload['type'] = 'Manual Action';
    
    const createCommentPayload = {};
    createCommentPayload['taskId'] = this.selectedAction.taskId;
    createCommentPayload['userId'] = this.userService.getUserId();
    createCommentPayload['taskName'] = 'Action';
    createCommentPayload['action'] = this.action;
    createCommentPayload['comment'] = this.commentValue;
    createCommentPayload['status'] = this.selectedAction.status;
    const assignee = [this.assigneeValue];
    const offerId = this.selectedAction.offerId;
    const actionTitle = this.titleValue;
    const actionDescription = this.descriptionValue;

    this.dashboardService.postComments(createCommentPayload).subscribe(() => {
      this.dashboardService.postActionForNapprove(createActionPayload).subscribe(() => {
        this.actionComment(overlaypanel, assignee, offerId, actionTitle, actionDescription);
      }, (error) => {
        console.log(error);
        this.actionComment(overlaypanel, assignee, offerId, actionTitle, actionDescription);
      });
    });
    this.createActionForm.reset();
  }

  actionComment(overlaypanel, assignee, offerId, actionTitle, actionDescription) {
    overlaypanel.hide();
    this.getMyActionsAndNotifications();
    this.actionsService.sendNotification(assignee, offerId, actionTitle, actionDescription).subscribe(() => { });
  }

  // Modified create approve function to add comments as like in Provide Deatils Section
  createApproveAction(event, overlaypanel1: OverlayPanel, overlaypanel2: OverlayPanel) {
    overlaypanel1.hide();
    overlaypanel2.show(event);
  }

  approveAction(overlaypanel: OverlayPanel) {
    const taskId = this.selectedAction.taskId;
    const userId = this.userService.getUserId();
    const taskName = 'Action';
    const action = 'Approved';
    const status = this.selectedAction.status;
    const createActionApprove: CreateActionApprove = new CreateActionApprove(
      taskId,
      userId,
      taskName,
      action,
      this.commentValue,
      false,
      status
    );
    this.actionsService.createActionApprove(createActionApprove).subscribe(() => {
      overlaypanel.hide();
      this.getMyActionsAndNotifications();
    });
    this.createActionForm.reset();
  }

  createApproveActionWithFeedback(overlaypanel: OverlayPanel) {
    const taskId = this.selectedAction.taskId;
    const userId = this.userService.getUserId();
    const taskName = 'Action';
    const action = 'Approved';
    const commentValue = this.reason;
    const status = this.selectedAction.status;
    const createActionApprove: CreateActionApprove = new CreateActionApprove(
      taskId,
      userId,
      taskName,
      action,
      commentValue,
      false,
      status
    );
    this.actionsService.createActionApprove(createActionApprove).subscribe(() => {
      overlaypanel.hide();
      this.getMyActionsAndNotifications();
    });
    this.createActionForm.reset();
  }

  createApproveActionWithDetails(overlaypanel: OverlayPanel) {
    if (this.selectedFile) {
      const fd = new FormData();
      fd.append('file', this.selectedFile, this.selectedFile.name);
      this.dashboardService.postFileUploadForAction(this.selectedCaseId, fd).subscribe(() => {
      });
    }

    const taskId = this.selectedAction.taskId;
    const userId = this.userService.getUserId();
    const taskName = 'Action';
    const action = 'Approved';
    const commentValue = this.reason;
    const status = this.selectedAction.status;
    const createActionApprove: CreateActionApprove = new CreateActionApprove(
      taskId,
      userId,
      taskName,
      action,
      commentValue,
      true,
      status
    );
    this.actionsService.createActionApprove(createActionApprove).subscribe(() => {
      overlaypanel.hide();
      this.getMyActionsAndNotifications();
    });
    if (this.createActionForm) {
      this.createActionForm.reset();
    }
  }

  uploadFile(e) {
    this.fileToUpload = e.target.files;
    this.selectedFile = this.fileToUpload[0];
    console.log(this.fileToUpload);
    console.log(this.selectedFile.name);

  }

  showprovideDetails(event, overlaypanel1: OverlayPanel, overlaypanel2: OverlayPanel) {
    overlaypanel1.hide();
    overlaypanel2.show(event);
  }
  
  solutioningAction(taskId,status){
    const postData = {
      'taskId': taskId,
      'userId': this.userService.getUserId(),
      'taskName': 'Action',
      'attachment': false,
      'comment': false,
      'action': 'Provide Details',
      'status' : status
    };
    this.dashboardService.postComments(postData).subscribe(() =>  {
    });
  }

  dismissNotification(overlaypanel: OverlayPanel) {
    const postData = {
      'taskId': this.selectedAction.taskId,
      'userId': this.userService.getUserId(),
      'taskName': 'Notification',
      'caseId': '',
      'offerId': '',
      'action': '',
      'comment': '',
      'status' : this.selectedAction.status
    };
    this.dashboardService.postDismissNotification(postData).subscribe(() => {
      overlaypanel.hide();
      this.getMyActionsAndNotifications();
    });
  }

  showOfferPopUp(event, action, overlaypanel: OverlayPanel) {
    this.selectedActionData = action;
    overlaypanel.toggle(event);
  }


  goToofferSolutioning(actionData) {
    if (actionData.title.toLowerCase() === 'provide details') {
      this.solutioningAction(actionData.taskId, actionData.status);
      this.router.navigate(['/offerSolutioning', actionData.offerId, actionData.caseId]);
    }
  }

  onBasicUpload() {
    console.log('milsss');
  }

  createNewOffer() {
    this.createOfferService.disablePrBEList = false;
    // this.createOfferService.coolOffer = this.createOfferService.coolOfferCopy;
    // this.createOfferService.currenTOffer.next('');
    this.router.navigate(['/coolOffer']);
  }
  enableSubmit(event): void {
    let passedString = event.target.value;
    let inputValue = passedString.trim();
    if (inputValue === '' || inputValue === null) {
      this.buttonIsDisabled = false;
    } else {
      this.buttonIsDisabled = true;
    }
  }
  getOfferViewLink() {
    const actionType = this.selectedAction.type;
    let page = 'offerDetailView';
    switch (actionType) {
      case 'Strategy Review':
        page = 'strategyReview';
        break;
      case 'Solutioning Action':
        page = 'offerSolutioning';
        break;
      case 'Design Review':
        page = 'designReview';
        break;
      default:
        page = 'offerDetailView';
        break;
    }
    this.router.navigate(['/', page, this.selectedAction.offerId, this.selectedAction.caseId]);
  }
}
