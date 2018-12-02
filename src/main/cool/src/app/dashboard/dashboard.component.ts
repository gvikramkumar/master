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
      });
  }

  processMyActionsList() {
    // console.log(this.myActionsList);

    this.myActions.forEach(element => {
      let obj = new ActionsAndNotifcations();
      obj.setOfferId(element.offerId);
      obj.setOfferName(element.offerName);

      // Set Actions
      let actionList = element.actionList;
      if (actionList.length > 0) {
        actionList.forEach(element => {
          obj.setActiontTitle(element.actiontTitle);
          obj.setAssigneeId(element.assigneeId);
          obj.setTriggerDate(element.triggerDate);
          obj.setDueDate(element.dueDate);
          obj.setActionDesc(element.actionDesc);
          obj.setStyleColor(this.determineStatus(element.dueDate,element.triggerDate));
          obj.setAlertType(1);
          this.myOfferArray.push(obj);
        });
      }

      let obj2 = new ActionsAndNotifcations();
      obj2.setOfferId(element.offerId);
      obj2.setOfferName(element.offerName);

      // Set Notifications
      let notificationList = element.notificationList;
      if (notificationList.length > 0) {
        notificationList.forEach(element => {
          obj2.setActiontTitle(element.notifcationTitle);
          obj2.setAssigneeId(element.assigneeId);
          obj2.setTriggerDate(element.triggerDate);
          obj2.setDueDate(element.dueDate);
          obj2.setStyleColor(this.determineStatus(element.dueDate,element.triggerDate));
          obj2.setAlertType(2);
          obj2.setActionDesc(element.notificationDesc);
          this.myOfferArray.push(obj2);
        });
      }
    });
    this.myActionsList = this.myOfferArray;
  }

  determineStatus(triggerDate,dueDate): string {
    // get current time using momentjs
    var now = moment(new Date());
    var triggerDate1 = moment(triggerDate);
    var dueDate1 = moment(dueDate);
 
    // Return Green
    var diffTime = moment.duration(now.diff(triggerDate1.add(moment.duration(12, 'hours')))).asHours();

     // Return Yellow
    var triggerDateTime =triggerDate1.add(moment.duration(12, 'hours'));
    var dueDateTime = dueDate1.subtract(moment.duration(24, 'hours'));
    var betweenDate = now.isBetween(triggerDateTime, dueDateTime);

     // Return Red
     var redDateTime = moment.duration(now.diff(dueDate1)).asHours();

    if (diffTime <= 12) {
      return 'Green';
    } else if (betweenDate) {
      return 'Yellow';
    } else if(redDateTime < 24 ) {
      return 'Red';
    }
  }
}
