import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Offer } from '../models/offer';
import { Router } from '@angular/router';
import { CreateOfferService } from '../services/create-offer.service';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActionsAndNotifcations } from './action';
import * as moment from 'moment';
import { MenuItem } from 'primeng/components/common/menuitem';

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
  myOffersListProps: any;
  myActions;
  myOfferArray: ActionsAndNotifcations[] = [];
  myOffers: ActionsAndNotifcations[] = [];
  pendingActnCount:number = 0;
  needImmActnCount:number = 0;
  display: boolean = false;
  displayPopOver: boolean = true;
  displayActionPopOver: boolean = true;
  currentOfferId;

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
        this.myOffersListProps = Object.keys(this.myOffersList);
        console.log(this.myOffersList);
      });

  }

  processMyActionsList() {
    this.myActions.forEach(element => {
      let obj = new ActionsAndNotifcations();
      obj.setOfferId(element.offerId);
      obj.setOfferName(element.offerName);
      obj.setStyleColor(element.status);

      // Set Actions
      let actionList = element.actionList;
      if (actionList != undefined && actionList.length > 0) {
        actionList.forEach(element => {
          obj.setActiontTitle(element.actiontTitle);
          obj.setAssigneeId(element.assigneeId);
          obj.setTriggerDate(this.dateFormat(element.triggerDate));
          obj.setDueDate(this.dateFormat(element.dueDate));
          obj.setActionDesc(element.actionDesc);
          //obj.setStyleColor(element.Status);
          obj.setAlertType(1);
          this.myOfferArray.push(obj);
        });
      }

      let obj2 = new ActionsAndNotifcations();
      obj2.setOfferId(element.offerId);
      obj2.setOfferName(element.offerName);
      obj2.setStyleColor(element.status);
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

  getMyActions() {
  this.dashboardService.getMyActionsList()
      .subscribe(data => {
        this.myActions = data;
        this.processMyActionsList();
      });
  }

  createNewOffer() {
    this.createOfferService.coolOffer = this.createOfferService.coolOfferCopy;
    this.createOfferService.currenTOffer.next('')
    this.router.navigate(['/coolOffer']);
  }

  showDialog() {
    this.display = true;
  }

  dismissNotification(offerId) {
    let userId = this.userService.getUserId();
    let postData = {
      "userId": userId,
      "offerId": offerId,
      "dismissedNotification": true
  };
    this.dashboardService.postDismissNotification(postData)
    this.displayPopOver = false;
    console.log("dismissed");
   this.getMyActions();
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

  displayActionPop() {
    this.displayActionPopOver = true;
  }

  offerDetailOverView(Id) {
    this.router.navigate(['/offerDetailView', Id]);
  }
}
