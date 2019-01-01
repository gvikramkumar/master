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
      });
  }

  processMyActionsList() {
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
        // Set the status color
        if (element.status === 'Red') {
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
          obj2.setDueDate('--');
          obj2.setStyleColor('--');
          obj2.setActionDesc(element.actionDesc);
          obj2.setAlertType(2);
          obj2.setCaseId(element.caseId);
          this.myOfferArray.push(obj2);
        });
        this.myActionsList = this.myOfferArray;
      }
    }
  }

  dateFormat(inputDate: string) {
    return moment(inputDate).format('DD-MMM-YYYY');
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

  dismissNotification(offerId, popover) {
    const userId = this.userService.getUserId();
    const postData = {
      'userId': userId,
      'offerId': offerId,
      'dismissedNotification': true
    };
    this.dashboardService.postDismissNotification(postData);
    popover.close();
    console.log('dismissed');
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

  displayActionPop(popover) {
    if (popover.isOpen()) {
      popover.close();
    }
  }

  offerDetailOverView(offerId,caseId) {
    console.log(offerId);
    console.log(caseId);
    // this.router.navigate(['/mmassesment', this.offerId, this.caseId]);
    this.router.navigate(['/offerDetailView', offerId,caseId]);
  }
}
