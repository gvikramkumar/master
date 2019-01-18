import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActionsAndNotifcations } from '../dashboard/action';
import * as moment from 'moment';
import { ActionsService } from '../services/actions.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CreateOfferService } from '../services/create-offer.service';
import { DashboardService } from '../services/dashboard.service';
import { NgForm } from '@angular/forms';
import { CreateAction } from '../models/create-action';
import { CreateActionService } from '../services/create-action.service';




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
    this.actionsService.getMilestones(this.offerCaseMap[offerId]).subscribe(data => {
      this.milestoneList = [];
      this.lastValueInMilestone=[];
      for (let prop in data) {
       data[prop].forEach(ele => {
        this.milestoneList.push(ele);
        
        this.lastValueInMilestone=this.milestoneList.slice(-1)[0];
        console.log("this.lastValueInMilestone",this.lastValueInMilestone);
         let mile=this.lastValueInMilestone
         this.val=mile['subMilestone'];
         console.log("val",this.val);
         console.log("mile",mile);
         console.log(typeof mile);
       //console.log("this.milestone submilestone",this.milestone['submilestone']);
      // console.log("this.milestone",this.milestone);
   
       });
    }
    });

    this.actionsService.getAssignee(offerId).subscribe(data => {
      this.assigneeList = data;
    });
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
      this.milestoneValue,
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

}
