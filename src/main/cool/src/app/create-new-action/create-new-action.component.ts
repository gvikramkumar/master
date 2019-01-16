import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { manualAction } from '../models/manualAction';
import { SearchCollaboratorService } from '../services/search-collaborator.service';
import { UserService } from '../services/user.service';
import { CreateOfferService } from '../services/create-offer.service';
import { DashboardService } from '../services/dashboard.service';
@Component({
  selector: 'app-create-new-action',
  templateUrl: './create-new-action.component.html',
  styleUrls: ['./create-new-action.component.css']
})
export class CreateNewActionComponent implements OnInit {

  manualactionList;
  actionListData;
  manualaction;
  myOfferList;
  assigneeList;
  functionNameValue;
  selectedOfferName;
  addManualAction;

  constructor(private router: Router, 
    private searchCollaboratorService: SearchCollaboratorService,
    private userService: UserService,
    private createOfferService: CreateOfferService,
    private dashboardService: DashboardService) {
    }

  ngOnInit() {
    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
     const actionListData = [];
          let functionalRoleData = data.userMappings;
          functionalRoleData.forEach(element => {
            this.manualactionList = element.functionalRole;
          });
        });
        this.manualactionList = this.actionListData;
  this.dashboardService.getMyOffersList().subscribe(data => {
    this.myOfferList = data;
    for(var i; i < this.myOfferList.length; i++) {
      if(this.myOfferList[i].stakeholders !== null ) {
          let test = this.myOfferList[i].stakeholders;
    } 
  }
  });
  }
  cancel() {
 this.router.navigate(['/action']);
  }

  createAction() {
    this.router.navigate(['/action']);
     }
}
