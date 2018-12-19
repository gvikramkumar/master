import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActionsAndNotifcations } from '../dashboard/action';
import * as moment from 'moment';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {

  myActionsList;
  myActions;
  pendingActnCount:number = 0;
  needImmActnCount:number = 0;
  myOfferArray: ActionsAndNotifcations[] = [];

  constructor(private router: Router, private dashboardService: DashboardService,
    private userService: UserService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.dashboardService.getMyActionsList()
    .subscribe(data => {
      this.myActions = data;
      this.processMyActionsList();
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
    });
  }
  createNewAction() {
    this.router.navigate(['/createNewAction']);
  }

  dateFormat(inputDate:string){
    return moment(inputDate).format('DD-MMM-YYYY');
  }
}
