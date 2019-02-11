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
  offerCaseMap:object = {};
  offerNameMap: object = {};
  offerOwnerMap: object = {};
  actionOwner: string;
  lastValueInMilestone:Array<any>;
  milestone: any;
  val: any;
  selectedCaseId: any;


  constructor(private router: Router, private actionsService: ActionsService,
    private userService: UserService, private httpClient: HttpClient,
    private createOfferService: CreateOfferService,
    private dashboardService: DashboardService,
    private createActionService: CreateActionService,
    ) { }

  ngOnInit() {
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });
    this.minDate = new Date();
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

  // this.userService.getName().subscribe(data => {
  //   this.actionOwner = data;
  // })

  }
// Lulu's Code
  // onChange(offerId) {
  //   this.actionsService.getMilestones(this.offerCaseMap[offerId]).subscribe(data => {
  //     this.milestoneList = [];
  //     for (let prop in data) {
  //      data[prop].forEach(ele => {
  //       this.milestoneList.push(ele);
  //      });
  //   }
  //   });

  //   this.actionsService.getAssignee(offerId).subscribe(data => {
  //     this.assigneeList = data;
  //   });
  // }

  onChange(offerId) {

    this.selectedofferId = offerId;
    if (this.selectedofferId != null && this.selectedfunctionRole != null && this.stakeHolders[this.selectedofferId] != null && this.stakeHolders[this.selectedofferId][this.selectedfunctionRole] != null) {
      this.assigneeList = this.stakeHolders[this.selectedofferId][this.selectedfunctionRole];
    } else {
      this.assigneeList = [];
    }

    this.actionsService.getAchievedMilestones(this.offerCaseMap[offerId]).subscribe(resMilestones => {
      this.milestoneList = [];
      this.lastValueInMilestone=[];
      for (let prop in resMilestones) {
       resMilestones[prop].forEach(ele => {
        this.milestoneList.push(ele);
        
        this.lastValueInMilestone=this.milestoneList.slice(-1)[0];
        
         let mile=this.lastValueInMilestone
         this.val=mile['subMilestone'];
        
       });
    }
    });

    // this.actionsService.getAssignee(offerId).subscribe(data => {
    //   this.assigneeList = data;
    // });
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
        if ( element.status && element.status.toLowerCase() === 'red') {
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
     // Process post data
    const selectedAssignee = [this.assigneeValue];
    const type = 'Manual Action';
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
    this.actionsService.createNewAction(createAction).subscribe((data) => {
      this.closeActionDailog();
    });
  }


  showOfferPopUp(event, action, overlaypanel: OverlayPanel) {
    this.selectedCaseId = action.caseId;
    overlaypanel.toggle(event);
  }
 /*  displayPop() {
    this.displayPopOver = true;
  } */

  displayActionPop(popover) {
    if (popover.isOpen()) {
      popover.close();
    }

  }
  createNewAction() {
    this.displayActionPhase = true;
  }

  closeActionDailog() {
    this.displayActionPhase = false;
    this.createActionForm.reset();
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
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = nameOfFileToDownload;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

      }
    });
  }
}
