import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CreateOfferService, DashboardService } from '@shared/services';
@Component({
  selector: 'app-create-new-action',
  templateUrl: './create-new-action.component.html',
  styleUrls: ['./create-new-action.component.css']
})
export class CreateNewActionComponent implements OnInit, OnDestroy {

  manualactionList;
  actionListData;
  manualaction;
  myOfferList;
  assigneeList;
  functionNameValue;
  selectedOfferName;
  addManualAction;
  createOfferServiceSubscriber: any;

  constructor(private router: Router,
    private createOfferService: CreateOfferService,
    private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.createOfferServiceSubscriber = this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
      const actionListData = [];
      let functionalRoleData = data.userMappings;
      functionalRoleData.forEach(element => {
        this.manualactionList = element.functionalRole;
      });
    });
    this.manualactionList = this.actionListData;
    this.dashboardService.getMyOffersList().subscribe(data => {
      this.myOfferList = data;
      for (var i = 0; i < this.myOfferList.length; i++) {
        if (this.myOfferList[i].stakeholders !== null) {
          let test = this.myOfferList[i].stakeholders;
        }
      }
    });
  }
  ngOnDestroy() {
    this.createOfferServiceSubscriber.unsubscribe();
  }
  cancel() {
    this.router.navigate(['/action']);
  }

  createAction() {
    this.router.navigate(['/action']);
  }
}
