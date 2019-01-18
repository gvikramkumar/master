import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, ɵConsole, Output, EventEmitter } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Offer } from '../models/offer';
import { Router } from '@angular/router';
import { CreateOfferService } from '../services/create-offer.service';
import { UserService } from '../services/user.service';
import { ActionsAndNotifcations } from './action';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgForm } from '@angular/forms';
import { CreateActionComment } from '../models/create-action-comment';
import { ActionsService } from '../services/actions.service';
import { CreateActionApprove } from '../models/create-action-approve';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {
  @ViewChild('createActionForm') createActionForm: NgForm;
  @ViewChild('createActionApproveForm') createActionApproveForm: NgForm;
  recentOfferList: Offer[];
  myActionsList;
  myOffersList;
  myOffersListProps: any;
  myActions;
  myOfferArray: ActionsAndNotifcations[] = [];
  myOffers: ActionsAndNotifcations[] = [];
  pendingActnCount = 0;
  needImmActnCount = 0;
  display: Boolean = false;
  displayPopOver: Boolean = true;
  displayActionPopOver: Boolean = true;
  currentOfferId;
  currentCaseId;
  currentOfferName;
  showFeedbackButtons: Boolean = true;
  doNotApproveSection = false;
  showConditionalApprovalSection = false;
  showApproveSection = false;
  hidepopup;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  minDate: Date;
  cols: any[];
  selectedrow: any;
  taskId: any;
  actionsArray: any[];
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
  action: any;
  loading;
  constructor(private dashboardService: DashboardService,
    private router: Router,
    private createOfferService: CreateOfferService,
    private userService: UserService,
    private actionsService: ActionsService) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'offerId', header: 'OFFER ID' },
      { field: 'offerName', header: 'OFFER NAME' },
      { field: 'offerOwner', header: 'OFFER OWNER' },
      { field: 'expectedLaunchDate', header: 'LAUNCH DATE' }
    ];

    this.getMyActionsList();

    this.dashboardService.getMyOffersList()
      .subscribe(data => {
        this.myOffersList = data;
        this.myOffersListProps = Object.keys(this.myOffersList);
      });
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });
    this.minDate = new Date();

    this.actionsService.getFunction().subscribe(data => {
      this.functionList = data;
    });
  }

  getMyActionsList() {
    this.dashboardService.getMyActionsList()
      .subscribe(data => {
        this.myActions = data;
        this.processMyActionsList();
      });
  }

  processMyActionsList() {
    this.myOfferArray = [];
    // Process Actions
    if (this.myActions.actionList !== undefined) {
      this.myActions['actionList'].forEach(element => {
        const obj = new ActionsAndNotifcations();
        obj.setOfferId(element.offerId);
        obj.setOfferName(element.offerName);
        obj.setStyleColor(element.status);
        obj.setAssigneeId(element.assigneeId);
        obj.setTriggerDate(this.dateFormat(element.triggerDate));
        obj.setDueDate(this.dateFormat(element.dueDate));
        obj.setActionDesc(element.actionDesc);
        obj.setAlertType(1);
        obj.setCaseId(element.caseId);
        obj.setTaskId(element.taskId);
        obj.setType(element.type);
        obj.setActiontTitle(element.actiontTitle);

        // Set the status color
        if (element.status && element.status.toLowerCase() === 'red') {
          this.needImmActnCount = this.needImmActnCount + 1;
        } else {
          this.pendingActnCount = this.pendingActnCount + 1;
        }
        this.myOfferArray.push(obj);
      });

      // Process Notifications
      if (this.myActions.notificationList !== undefined) {
        this.myActions['notificationList'].forEach(element => {
          const obj2 = new ActionsAndNotifcations();
          obj2.setOfferId(element.offerId);
          obj2.setOfferName(element.offerName);
          obj2.setAssigneeId(element.assigneeId);
          obj2.setTriggerDate(this.dateFormat(element.triggerDate));
          obj2.setDueDate(this.dateFormat(element.dueDate));
          obj2.setStyleColor(element.status);
          obj2.setActionDesc(element.actionDesc);
          obj2.setAlertType(2);
          obj2.setCaseId(element.caseId);
          obj2.setTaskId(element.taskId);
          this.myOfferArray.push(obj2);
        });
        this.myActionsList = this.myOfferArray;
      }
    }
  }

  doNotApprove() {
    this.hidepopup = true;
    this.doNotApproveSection = true;
    this.action = 'not approved';
  }

  conditionalApprove() {
    this.hidepopup = true;
    this.showConditionalApprovalSection = true;
    this.action = 'conditionally Approved';
  }

  approve() {
    this.hidepopup = true;
    this.showApproveSection = true;
    this.action = 'approved';
  }

  dateFormat(inputDate: string) {
    return moment(inputDate).format('DD-MMM-YYYY');
  }

  selectedrownof(actionData) {
    this.selectedrow = actionData;
    this.taskId = actionData.taskId;
    this.currentOfferId = actionData.offerId;
    this.currentCaseId = actionData.caseId;
    this.currentOfferName = actionData.offerName;
    this.actionsService.getAssignee(actionData.offerId).subscribe(data => {
      this.assigneeList = data;
    });
    this.actionsService.getMilestones(actionData.caseId).subscribe(data => {
      this.milestoneList = [];
      for (const milestone in data) {
        if (data) {
          data[milestone].forEach(element => {
            this.milestoneList.push(element);
          });
        }
      }
    });
  }

  getMyActions() {
    // reset pending count
    this.pendingActnCount = 0;
    this.needImmActnCount = 0;

    this.dashboardService.getMyActionsList()
      .subscribe(data => {
        this.myActions = data;
        this.processMyActionsList();
      });
  }

  createNewOffer() {
    this.createOfferService.coolOffer = this.createOfferService.coolOfferCopy;
    this.createOfferService.currenTOffer.next('');
    this.router.navigate(['/coolOffer']);
  }

  showDialog() {
    this.display = true;
  }

  selectionChange(value) {
    this.selectedrow = value;
  }

  dismissNotification(offerId, popover) {
    const postData = {
      'taskId': this.selectedrow.taskId,
      'userId': this.selectedrow.assigneeId,
      'taskName': 'Notification',
      'caseId': '',
      'offerId': '',
      'action': '',
      'comment': ''
    };
    this.dashboardService.postDismissNotification(postData).subscribe(data => {
      popover.close();
      this.getMyActions();
    });
  }

  closeNotification() {
    this.displayPopOver = false;
  }

  closeActionNotification() {
    this.displayActionPopOver = false;
  }

  displayPop() {
    this.displayPopOver = true;
  }

  displayActionPop(popover) {
    this.hidepopup = false;
    this.doNotApproveSection = false;
    this.showConditionalApprovalSection = false;
    this.showApproveSection = false;
    if (popover.isOpen()) {
      popover.close();
    }
  }

  offerDetailOverView(offerId, caseId) {
    this.router.navigate(['/offerDetailView', offerId, caseId]);
  }
// Not and conditional approve?
  createAction(popover) {
    const createActionPayload = {};
    createActionPayload['offerName'] = this.currentOfferName;
    createActionPayload['owner'] = this.assigneeValue;
    createActionPayload['assignee'] = [this.assigneeValue];
    createActionPayload['offerId'] = this.currentOfferId;
    createActionPayload['caseId'] = this.currentCaseId;
    createActionPayload['description'] = this.descriptionValue;
    createActionPayload['actionTitle'] = this.titleValue;
    createActionPayload['duedate'] = this.dueDateValue.toISOString();
    createActionPayload['mileStone'] = this.milestoneValue;
    createActionPayload['selectedfunction'] = this.functionNameValue;
    createActionPayload['type'] = 'Manual Action';
    const createCommentPayload = {};
    createCommentPayload['taskId'] = this.taskId;
    createCommentPayload['userId'] = this.userService.getUserId();
    createCommentPayload['taskName'] = 'Action';
    createCommentPayload['action'] = this.action;
    createCommentPayload['comment'] = this.commentValue;

    this.dashboardService.postComments(createCommentPayload).subscribe((data) => {
      this.dashboardService.postActionForNapprove(createActionPayload).subscribe(response => {
        this.displayActionPop(popover);
        this.getMyActionsList();
      });
    });
    this.createActionForm.reset();
  }



  createActionApprove(popover) {
    const taskId = this.taskId;
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
      this.displayActionPop(popover);
      this.getMyActionsList();
    });
    this.createActionForm.reset();
  }

// Change date format for offer list
  transferDateFormat(offerData, field) {
    if (field === 'expectedLaunchDate') {
      return moment(offerData[field]).format('DD-MMM-YYYY');
    } else {
      return offerData[field];
    }
  }
}
