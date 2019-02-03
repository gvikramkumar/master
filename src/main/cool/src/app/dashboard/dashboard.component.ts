import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Router } from '@angular/router';
import { CreateOfferService } from '../services/create-offer.service';
import { UserService } from '../services/user.service';
import { NgForm } from '@angular/forms';
import { ActionsService } from '../services/actions.service';
import { CreateActionApprove } from '../models/create-action-approve';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {
  @ViewChild('createActionForm') createActionForm: NgForm;
  @ViewChild('createActionApproveForm') createActionApproveForm: NgForm;


  myActionsAndNotifications = [];
  myOffers;
  pendingActionCount = 0;
  needImmediateActionCount = 0;
  showDoNotApproveSection = false;
  showConditionalApprovalSection = false;
  showApproveSection = false;
  showActionSection = true;
  showProvideDetailsPopUp = false;

  minDate = new Date();
  offerColumns: any[];

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
  reason: String = '';

  constructor(private dashboardService: DashboardService,
    private router: Router,
    private createOfferService: CreateOfferService,
    private userService: UserService,
    private actionsService: ActionsService) {
  }

  ngOnInit() {
    this.offerColumns = [
      { field: 'offerId', header: 'OFFER ID' },
      { field: 'offerName', header: 'OFFER NAME' },
      { field: 'offerOwner', header: 'OFFER OWNER' },
      { field: 'expectedLaunchDate', header: 'LAUNCH DATE' }
    ];

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
      notification.assigneeId = notification.assigneeId ? notification.assigneeId.split(',').join(', ') : '';

      return notification;
    });
  }

  private processActions(actions: any) {
    this.needImmediateActionCount = 0;
    this.pendingActionCount = 0;
    return actions.map(action => {
      this.processActionCount(action);
      action.alertType = 'action';
      action.title = action.actiontTitle;
      action.desc = action.actionDesc;
      action.assigneeId = action.assigneeId ? action.assigneeId.split(',').join(', ') : '';

      return action;
    });
  }

  private processActionCount(action: any) {
    if (action.status && action.status.toLowerCase() === 'red') {
      ++this.needImmediateActionCount;
    } else {
      ++this.pendingActionCount;
    }

  }

  private getMyOffers() {
    this.dashboardService.getMyOffersList()
      .subscribe(resOffers => {
        this.myOffers = resOffers;
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

 
  // getActionFormValues() {
  //   if (this.selectedAction.offerId && this.selectedAction.caseId) {
  //     this.actionsService.getAssignee(this.selectedAction.offerId).subscribe(resAssignee => {
  //       this.assigneeList = resAssignee;
  //     });
  //     this.actionsService.getMilestones(this.selectedAction.caseId).subscribe(resMilestones => {
  //       this.milestoneList = Object.keys(resMilestones).reduce((accumulator, current) => accumulator.concat(resMilestones[current]), []);
  //     });
  //   }
  // }
  getActionFormValues() {
    this.selectedofferId = this.selectedAction.offerId;
    this.selectedCaseId = this.selectedAction.caseId;
    if (this.selectedofferId != null && this.selectedfunctionRole != null && this.stakeHolders[this.selectedofferId] != null && this.stakeHolders[this.selectedofferId][this.selectedfunctionRole] != null) {
      this.assigneeList = this.stakeHolders[this.selectedofferId][this.selectedfunctionRole];
    } else {
      this.assigneeList = [];
    }
    this.actionsService.getAchievedMilestones(this.selectedCaseId).subscribe(resMilestones => {
      this.milestoneList = [];
      this.lastValueInMilestone = [];
      for (const prop in resMilestones) {
        if (prop) {
          resMilestones[prop].forEach(ele => {
            this.milestoneList.push(ele);
            this.lastValueInMilestone = this.milestoneList.slice(-1)[0];
            const mile = this.lastValueInMilestone;
            this.val = mile['subMilestone'];
          });
        }
      }
    });
  }

  getSelectFunctionRole(functionRole) {
    this.selectedfunctionRole = functionRole;
    if (this.selectedofferId != null && this.selectedfunctionRole != null && this.stakeHolders[this.selectedofferId] != null && this.stakeHolders[this.selectedofferId][this.selectedfunctionRole] != null) {
      this.assigneeList = this.stakeHolders[this.selectedofferId][this.selectedfunctionRole];
    } else {
      this.assigneeList = [];
    }
  }

  manualActioncomplete(){

  }

  doNotApprove() {
    this.showActionSection = false;
    this.showDoNotApproveSection = true;
    this.action = 'not approved';
  }

  conditionalApprove() {
    this.showActionSection = false;
    this.showConditionalApprovalSection = true;
    this.action = 'conditionally Approved';
  }

  approve() {
    this.showActionSection = false;
    this.showApproveSection = true;
    this.action = 'approved';
  }

  createNotAndConditionalAction(overlaypanel: OverlayPanel) {
    const createActionPayload = {};
    createActionPayload['offerName'] = this.selectedAction.offerName;
    createActionPayload['owner'] = this.assigneeValue;
    createActionPayload['assignee'] = [this.assigneeValue];
    createActionPayload['offerId'] = this.selectedAction.offerId;
    createActionPayload['caseId'] = this.selectedAction.caseId;
    createActionPayload['description'] = this.descriptionValue;
    createActionPayload['actionTitle'] = this.titleValue;
    createActionPayload['dueDate'] = this.dueDateValue.toISOString();
    createActionPayload['mileStone'] = this.milestoneValue;
    createActionPayload['selectedfunction'] = this.functionNameValue;
    createActionPayload['type'] = 'Manual Action';
    const createCommentPayload = {};
    createCommentPayload['taskId'] = this.selectedAction.taskId;
    createCommentPayload['userId'] = this.userService.getUserId();
    createCommentPayload['taskName'] = 'Action';
    createCommentPayload['action'] = this.action;
    createCommentPayload['comment'] = this.commentValue;

    this.dashboardService.postComments(createCommentPayload).subscribe((data) => {
      this.dashboardService.postActionForNapprove(createActionPayload).subscribe(response => {
        overlaypanel.hide();
        this.getMyActionsAndNotifications();
      });
    });
    this.createActionForm.reset();
  }

  createApproveAction(overlaypanel: OverlayPanel) {
    const taskId = this.selectedAction.taskId;
    const userId = this.userService.getUserId();
    const taskName = 'Action';
    const action ='Approved';
    const createActionApprove: CreateActionApprove = new CreateActionApprove(
      taskId,
      userId,
      taskName,
      action,
      this.commentValue
    );
    this.actionsService.createActionApprove(createActionApprove).subscribe((data) => {
      overlaypanel.hide();
      this.getMyActionsAndNotifications();
    });
    this.createActionForm.reset();
  }

  showprovideDetails(event, overlaypanel1: OverlayPanel, overlaypanel2: OverlayPanel) {
    overlaypanel1.hide();
    overlaypanel2.show(event);
  }
  dismissNotification(overlaypanel: OverlayPanel) {
    const postData = {
      'taskId': this.selectedAction.taskId,
      'userId': this.selectedAction.assigneeId,
      'taskName': 'Notification',
      'caseId': '',
      'offerId': '',
      'action': '',
      'comment': ''
    };
    this.dashboardService.postDismissNotification(postData).subscribe(data => {
      overlaypanel.hide();
      this.getMyActionsAndNotifications();
    });
  }

  showOfferPopUp(event, action, overlaypanel: OverlayPanel) {
    this.selectedActionData = action;
    overlaypanel.toggle(event);
  }

  createNewOffer() {
    this.createOfferService.coolOffer = this.createOfferService.coolOfferCopy;
    this.createOfferService.currenTOffer.next('');
    this.router.navigate(['/coolOffer']);
  }
  goToofferSolutioning(offerId,caseId,actiontTitle){
    if (actiontTitle.toLowerCase() === 'provide details') {
      this.router.navigate(['/offerSolutioning', offerId, caseId]);
    }
  }

  enableSubmit(event): void {
    let passedString = event.target.value;
    let inputValue = passedString.trim();
    if(inputValue === "" || inputValue === null) {
     this.buttonIsDisabled=false;
    } else {
     this.buttonIsDisabled=true;
    }
 }

//  submit() {
//   let holdData= {};
//   holdData['taskId'] = '';
//   holdData['userId'] = this.userService.getUserId();
//   holdData['caseId'] = this.caseId;
//   holdData['offerId'] = this.currentOfferId;
//   holdData['taskName'] = 'discard';
//   holdData['action'] = 'hold';
//   holdData['comment'] = this.reason;

//   let cancelData={};
//   cancelData['taskId'] = '';
//   cancelData['userId'] = this.userService.getUserId();
//   cancelData['caseId'] = this.caseId;
//   cancelData['offerId'] = this.currentOfferId;
//   cancelData['taskName'] = 'discard';
//   cancelData['action'] = 'cancel';
//   cancelData['comment'] = this.reason;

//   if (this.popupType === 'hold') {
//     this.menuBarService.holdOffer(holdData).subscribe(res => {
//       this.closePopup.next('hold');
//     });
//   } else if (this.popupType === 'cancel') {
//     this.menuBarService.cancelOffer(cancelData).subscribe(res => {
//       this.closePopup.next('cancel');
//     });
//   }
  
// }
}
