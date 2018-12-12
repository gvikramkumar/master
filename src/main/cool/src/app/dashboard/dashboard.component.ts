import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Offer } from '../models/offer';
import { Router } from '@angular/router';
import { CreateOfferService } from '../services/create-offer.service';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActionsAndNotifcations } from './action';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {
  recentOfferList: Offer[];
  myActionsList;
  myOffersList;
  myActions;
  myOfferArray: ActionsAndNotifcations[] = [];
  pendingActnCount:number = 0;
  needImmActnCount:number = 0;
  display: boolean = false;
  displayPopOver: boolean = true;

  constructor(private dashboardService: DashboardService,
    private router: Router, private createOfferService: CreateOfferService,
    private userService: UserService, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.dashboardService.getMyActionsList()
      .subscribe(data => {
        this.myActions = data;
        this.processMyActionsList();
      });

    this.dashboardService.getMyOffersList()
      .subscribe(data => {
        this.myOffersList = data;
        console.log(this.myOffersList);
      });

  }

  processMyActionsList() {
    this.myActions.forEach(element => {
      let obj = new ActionsAndNotifcations();
      obj.setOfferId(element.offerId);
      obj.setOfferName(element.offerName);

      // Set Actions
      let actionList = element.actionList;
      if (actionList != undefined && actionList.length > 0) {
        actionList.forEach(element => {
          obj.setActiontTitle(element.actiontTitle);
          obj.setAssigneeId(element.assigneeId);
          obj.setTriggerDate(this.dateFormat(element.triggerDate));
          obj.setDueDate(this.dateFormat(element.dueDate));
          obj.setActionDesc(element.actionDesc);
          obj.setStyleColor(this.determineStatus( element.triggerDate,element.dueDate));
          obj.setAlertType(1);
          this.myOfferArray.push(obj);
        });
      }

      let obj2 = new ActionsAndNotifcations();
      obj2.setOfferId(element.offerId);
      obj2.setOfferName(element.offerName);

      // Set Notifications
      let notificationList = element.notificationList;
      if (notificationList!= undefined && notificationList.length > 0) {
        notificationList.forEach(element => {
          obj2.setActiontTitle(element.notifcationTitle);
          obj2.setAssigneeId(element.assigneeId);
          obj2.setTriggerDate(this.dateFormat(element.triggerDate));
          obj2.setDueDate("--");
          obj2.setStyleColor("--");
          obj2.setAlertType(2);
          obj2.setActionDesc(element.notificationDesc);
          this.myOfferArray.push(obj2);
        });
      }
    });
    this.myActionsList = this.myOfferArray;
  }

  dateFormat(inputDate:string){
    return moment(inputDate).format('DD-MMM-YYYY');
  }
  determineStatus(triggerDate, dueDate): string {

  /* Status � Status� should be editable by Owner / Co-Owner within �My Offers� View. 
  Notifications will not have a Status
  Green = up to 12 hours from the trigger date
  Yellow = (Trigger date + 12 hours) up to (Due date � 24 hours)
  Red = Less than 24 hours from Due date
  */

    // get current time using momentjs
    var now = moment(new Date());
    var alertTriggerDate = moment(triggerDate);
    var alertDueDate = moment(dueDate);

    // Return Green
    var triggerDatePlus12Hrs = moment(alertTriggerDate).add(12, 'hours');
    var diffTime = triggerDatePlus12Hrs.diff(now);

    // Return Yellow
    var triggerDateTime = alertTriggerDate.add(moment.duration(12, 'hours'));
    var dueDateTime = alertDueDate.subtract(moment.duration(24, 'hours'));
    var betweenDate = now.isBetween(triggerDateTime, dueDateTime);

    // Return Red
    var redDateTime = moment.duration(now.diff(alertDueDate)).asHours();
    
    if (redDateTime < 24) {
      this.needImmActnCount = this.needImmActnCount + 1;
      return 'Red';
    } else if (betweenDate) {
      this.pendingActnCount = this.pendingActnCount + 1;
      return 'Yellow';
    } else if (diffTime <= 12) {
      this.pendingActnCount = this.pendingActnCount + 1;
      return 'Green';
    } else{
      console.log('--')
    }
  }

  createNewOffer() {
    this.createOfferService.coolOffer = this.createOfferService.coolOfferCopy;
    this.createOfferService.currenTOffer.next('')
    this.router.navigate(['/coolOffer']);
  }

  showDialog() {
    this.display = true;
  }

  dismissNotification() {
    this.displayPopOver = false;
    console.log("dismissed");
  }

  closeNotification() {
    this.displayPopOver = false;
  }

  displayPop() {
    this.displayPopOver = true;
  }
}
