import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActionsAndNotifcations } from '../dashboard/action';
import * as moment from 'moment';
import { ActionsService } from '../services/actions.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CreateOfferService } from '../services/create-offer.service';
import { DashboardService } from '../services/dashboard.service';
import { NgForm } from '@angular/forms';
import { CreateAction } from '../models/create-action';
import { CreateActionService } from '../services/create-action.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { EnvironmentService } from '../../environments/environment.service';




@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {
  @ViewChild('createActionForm') createActionForm: NgForm;
  myActionsList;
  myActions;
  pendingActnCount = 0;
  needImmActnCount = 0;
  myOfferArray: ActionsAndNotifcations[] = [];
  displayActionPhase: Boolean = false;
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
  val: any;
  selectedCaseId: any;
  commentEvent: any;
  selectedAction;
  selectedOffer;

  constructor(private router: Router, private actionsService: ActionsService,
    private userService: UserService, private httpClient: HttpClient,
    private createOfferService: CreateOfferService,
    private dashboardService: DashboardService,
    private createActionService: CreateActionService,
    private environmentService: EnvironmentService,
  ) { }

  ngOnInit() {

    this.minDate = new Date();
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });


    this.actionsService.getActionsTracker()
      .subscribe(data => {
        this.myActions = data;
        this.processMyActionsList();
      });

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
          })
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
      for (let prop in resMilestones) {
        resMilestones[prop].forEach(ele => {
          this.milestoneList.push(ele);

          this.lastValueInMilestone = this.milestoneList.slice(-1)[0];

          let mile = this.lastValueInMilestone
          this.val = mile['subMilestone'];

        });
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

  processMyActionsList() {

    // Process get Actions data
    if (this.myActions.actionList !== undefined) {
      this.myActions['actionList'].forEach(element => {
        const obj = new ActionsAndNotifcations();
        obj.setOfferId(element.offerId);
        obj.setOfferName(element.offerName);
        obj.setOfferOwner(element.offerOwner);
        obj.setStyleColor(element.status);
        obj.setAssigneeId(element.assigneeId);
        obj.setTriggerDate(this.dateFormat(element.triggerDate));
        obj.setDueDate(this.dateFormat(element.dueDate));
        obj.setActionDesc(element.actionDesc);
        obj.setAttachment(element.attachment);
        obj.setAlertType(1);
        obj.setCaseId(element.caseId);
        obj.setCreatedBy(element.createdBy);
        obj.setCaseId(element.caseId);
        obj.setTaskId(element.taskId);
        obj.setDefaultFunctione(element.function);
        // Set the status color
        if (element.status && element.status.toLowerCase() === 'red') {
          this.needImmActnCount = this.needImmActnCount + 1;
        } else {
          this.pendingActnCount = this.pendingActnCount + 1;
        }
        this.myOfferArray.push(obj);
      });

      this.myActionsList = this.myOfferArray;
    }
  }
  // Create New Action
  createAction() {

    // Close Dialog Box
    this.displayActionPhase = false;

    // Process post data
    const type = 'Manual Action';
    const selectedAssignee = [this.assigneeValue];

    // Initialize CreateAction POJO
    const createAction: CreateAction = new CreateAction(
      this.offerNameValue,
      this.offerCaseMap[this.offerNameValue],
      this.titleValue,
      this.descriptionValue,
      // this.milestoneValue,
      this.val,
      this.functionNameValue,
      selectedAssignee,
      this.dueDateValue.toISOString(),
      this.offerOwnerMap[this.offerNameValue],
      this.offerNameMap[this.offerNameValue],
      type,
    );

    // Call CreateAction API
    this.actionsService.createNewAction(createAction).subscribe((data) => { });

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
    }
    overlaypanel.toggle(event);
  }

  displayActionPop(popover) {
    if (popover.isOpen()) {
      popover.close();
    }

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
        const url = `${this.environmentService.REST_API_FILE_DOWNLOAD_FOR_ACTION}/${caseid}`;
        var a = document.createElement('a');
        a.href = url;
        a.download = nameOfFileToDownload;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

      }
    });
  }
}
