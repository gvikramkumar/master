import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActionsAndNotifcations } from '@app/feature/dashboard/action';
import * as moment from 'moment';
import { ActionsService } from '@app/services/actions.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgForm } from '@angular/forms';
import { CreateAction } from '@app/models/create-action';
import { OverlayPanel } from 'primeng/overlaypanel';
import { EnvironmentService } from '@env/environment.service';
import { UserService } from '@app/core/services';
import { DashboardService } from '@shared/services';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {
  @ViewChild('createActionForm') createActionForm: NgForm;
  myActionsList;
  allActions;
  actionDetails;
  actionDetailList;
  offerId;
  actionDetailArray: ActionsAndNotifcations[] = [];
  actionCount = {
    pendingActionCount: 0,
    needImmediateActionCount: 0
  };
  myOfferArray: ActionsAndNotifcations[] = [];
  displayActionPhase: Boolean = false;
  displayActionDetails: Boolean = false;
  actionDetailsLoaded: Boolean = false;
  isActionCompleted: Boolean = false;
  minDate: Date;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  functionList;
  actionListData;
  manualaction;
  myOfferList;
  milestoneList = [];
  assigneeList;
  stakeHolders = {};
  selectedofferId: string = null;
  selectedfunctionRole: string = null;
  offerNameValue: string;
  commentValue: string;
  titleValue: string;
  descriptionValue: string;
  milestoneValue: string;
  functionNameValue: string;
  assigneeValue: Array<any>;
  dueDateValue: any;
  ownerValue: string;
  offerCaseMap: object = {};
  offerNameMap: object = {};
  offerOwnerMap: object = {};
  actionOwner: string;
  lastValueInMilestone: Array<any>;
  milestone: any;
  selectedCaseId: any;
  commentEvent: any;
  selectedAction;
  selectedOffer;
  actionColumns: any[];
  switchLabel = 'Show Mine';

  constructor(private actionsService: ActionsService,
    private userService: UserService, private dashboardService: DashboardService,
    private environmentService: EnvironmentService,
  ) { }

  ngOnInit() {

    this.minDate = new Date();
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });

    this.actionColumns = [
      { field: 'completed', header: 'ACTION COMPLETE'},
      { field: 'offerId', header: 'OFFER' },
      { field: 'offerName', hidden: true},
      { field: 'actionTitle', header: 'ACTION' },
      { field: 'actionDesc', hidden: true},
      { field: 'createdBy', header: 'ACTION CREATED BY' },
      { field: 'dueDate', header: 'DUE DATE' },
      { field: 'actionDetails', header: 'DETAILS'}
    ];
    this.getAllActions();

    this.dashboardService.getMyOffersList().subscribe(data => {
      this.myOfferList = data;
      data.forEach(ele => {
        this.offerCaseMap[ele.offerId] = ele.caseId;
        this.offerNameMap[ele.offerId] = ele.offerName;
        this.offerOwnerMap[ele.offerId] = ele.offerCreatedBy;
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

    this.actionsService.getFunction().subscribe(data => {
      this.functionList = data;
    });

  }

  onChange(offerId) {

    this.selectedofferId = offerId;
    if (this.selectedofferId != null && this.selectedfunctionRole != null && this.stakeHolders[this.selectedofferId] != null && this.stakeHolders[this.selectedofferId][this.selectedfunctionRole] != null) {
      this.assigneeList = this.stakeHolders[this.selectedofferId][this.selectedfunctionRole];
    } else {
      this.assigneeList = [];
    }

    this.actionsService.getAchievedMilestones(this.offerCaseMap[offerId]).subscribe(resMilestones => {
      this.milestoneList = [];
      this.lastValueInMilestone = [];
      for (const prop in resMilestones) {
        resMilestones[prop].forEach(ele => {
          this.milestoneList.push(ele);

          this.lastValueInMilestone = this.milestoneList.slice(-1)[0];

          const mile = this.lastValueInMilestone;
          this.milestoneValue = mile['subMilestone'];

        });
      }
    });

  }

  getSelectFunctionRole(functionRole) {
    // Reset AssignList and AsigneeValue before service call
    this.assigneeValue = [];
    this.assigneeList = [];
    this.selectedfunctionRole = functionRole;
    if (this.selectedofferId != null && this.selectedfunctionRole != null && this.stakeHolders[this.selectedofferId] != null && this.stakeHolders[this.selectedofferId][this.selectedfunctionRole] != null) {
      this.assigneeList = this.stakeHolders[this.selectedofferId][this.selectedfunctionRole];
    } else {
      this.assigneeList = [];
    }
  }

  getAllActions() {
    this.actionsService.getActionsTracker()
      .subscribe(data => {
        this.allActions = data;
        this.processMyActionsList(false);
      });
  }

  handleSwitchChange(event) {
    const isChecked = event.checked;
    if (isChecked == true) {
      this.processMyActionsList(true);
    } else {
      this.processMyActionsList(false);
    }
  }
  processMyActionsList(flag) {
    this.myOfferArray = [];
        this.myActionsList = [];
        this.actionCount = {
          pendingActionCount: 0,
          needImmediateActionCount: 0
        };
    // Process get Actions data
    if (this.allActions.actionList !== undefined) {
      this.actionCount.pendingActionCount = this.allActions.pendingTasksCount;
      this.actionCount.needImmediateActionCount = this.allActions.immediateTasksCount;
      if (flag == true) {
      this.allActions['actionList'].forEach(element => {
          if (element.tracker == false) {
            const obj = new ActionsAndNotifcations();
            obj.setOfferId(element.offerId);
            obj.setOfferName(element.offerName);
            obj.setOfferOwner(element.offerOwner);
            obj.setActionDesc(element.actionDesc);
            obj.setAttachment(element.attachment);
            obj.setCompleted(element.completed);
            obj.setCaseId(element.caseId);
            obj.setCreatedBy(element.createdBy);
            obj.setTaskId(element.taskId);
            obj.setActionTitle(element.actionTitle);
            obj.setDueDate(this.dateFormat(element.dueDate));
            this.myOfferArray.push(obj);
          }
        });
      } else {
        this.allActions['actionList'].forEach(element => {
            const obj = new ActionsAndNotifcations();
            obj.setOfferId(element.offerId);
            obj.setOfferName(element.offerName);
            obj.setOfferOwner(element.offerOwner);
            obj.setActionDesc(element.actionDesc);
            obj.setAttachment(element.attachment);
            obj.setCompleted(element.completed);
            obj.setCaseId(element.caseId);
            obj.setCreatedBy(element.createdBy);
            obj.setTaskId(element.taskId);
            obj.setActionTitle(element.actionTitle);
            obj.setDueDate(this.dateFormat(element.dueDate));
            this.myOfferArray.push(obj);
        });
      }

    }

    this.myActionsList = this.myOfferArray;
  }
// Create New Action
createAction() {

  // Close Dialog Box
  this.displayActionPhase = false;
  this.displayActionDetails = false;
  // Process post data
  const type = 'Manual Action';
  const selectedAssignee = [this.assigneeValue];

  // Initialize CreateAction POJO
  const createAction: CreateAction = new CreateAction(
    this.offerNameValue,
    this.offerCaseMap[this.offerNameValue],
    this.titleValue,
    this.descriptionValue,
    this.milestoneValue,
    this.functionNameValue,
    selectedAssignee,
    this.dueDateValue.toISOString(),
    this.offerOwnerMap[this.offerNameValue],
    this.offerNameMap[this.offerNameValue],
    this.userService.getUserId(),
    type,
  );

  // Call CreateAction API
  this.actionsService.createNewAction(createAction).subscribe(() => {
    this.getAllActions();  // refresh the table
  });

  // Reset The Form
  this.createActionForm.reset();

}

showActionPopUp(event, action, overlaypanel: OverlayPanel) {
  this.commentEvent = event;
  this.selectedAction = action;
  overlaypanel.toggle(event);
}


showOfferPopUp(event, action, overlaypanel: OverlayPanel) {
  this.selectedOffer = {
    caseId: action.caseId,
    offerId: action.offerId
  };
  overlaypanel.toggle(event);
}

displayActionPop(popover) {
  if (popover.isOpen()) {
    popover.close();
  }
}

closeActionDailog() {
  this.displayActionPhase = false;
  this.createActionForm.reset();
}

createNewAction() {
  this.displayActionPhase = true;
}

dateFormat(inputDate: string) {
  return moment(inputDate).format('DD-MMM-YYYY');
}

getActionDetailsFile(caseid) {
  this.actionsService.downloadActionDetailsFile(caseid).subscribe(data => {
    const nameOfFileToDownload = 'offer-details_' + caseid;
    const blob = new Blob([data], { type: 'application/octet-stream' });

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, nameOfFileToDownload);
    } else {
      const url = `${this.environmentService.REST_API_DOWNLOAD_FILE_FOR_ACTION}/${caseid}`;
      let a = document.createElement('a');
      a.href = url;
      a.download = nameOfFileToDownload;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    }
  });
}

showActionDetails(taskId) {
  this.displayActionDetails = true;
  this.actionDetailsLoaded = false;
  this.actionsService.getActionDetails(taskId)
    .subscribe(data => {
      this.actionDetailsLoaded = true;
      this.actionDetails = data;
      this.offerId = this.actionDetails.offerId;
      this.actionDetailList = [];
      this.processMyActionDetailList();
    });
}

processMyActionDetailList() {
  // Process get Actions data
  if (this.actionDetails !== undefined) {
    const obj = new ActionsAndNotifcations();
    obj.setStyleColor(this.actionDetails.status);
    obj.setAssigneeId(this.actionDetails.assigneeId);
    obj.setTriggerDate(this.dateFormat(this.actionDetails.triggerDate));
    obj.setDueDate(this.dateFormat(this.actionDetails.dueDate));
    obj.setDefaultFunctione(this.actionDetails.function);
    if (this.actionDetails.completed == false) {
      obj.setCompletedDate('');
    } else {
      obj.setCompletedDate(this.dateFormat(this.actionDetails.reviewedOn));
    }
    this.actionDetailList.push(obj);
  }
}

closeActionDetails() {
  this.displayActionDetails = false;
  // this.createActionForm.reset();
}
}
