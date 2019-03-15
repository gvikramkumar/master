import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CreateOfferService } from '@shared/services';
import { panelsConstants, userPanelsConstants, dotBoxConstants, resultTableConstants } from '@shared/constants';

const searchOptions = ['Option1', 'Option2', 'Option3', 'Option4'];
@Component({
  selector: 'app-create-new-offer',
  templateUrl: './create-new-offer.component.html',
  styleUrls: ['./create-new-offer.component.css']
})
export class CreateNewOfferComponent implements OnInit {
  panels = panelsConstants;
  userPanels = userPanelsConstants;
  dotBox = dotBoxConstants;
  resultTable = resultTableConstants;
  search = (text$: Observable<string>) =>
    text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term => term.length < 0 ? []
          : searchOptions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      );
  backdropCustom = false;

  reqType = 'state';


  offerData = {
    "offname": this.createOfferService.coolOffer.offerName,
    "desc": this.createOfferService.coolOffer.offerDesc,
    "launch_date": new Date(this.createOfferService.coolOffer.expectedLaunchDate),
    "busunit": this.createOfferService.coolOffer.businessUnit,
    "busentity": this.createOfferService.coolOffer.businessEntity
  }
  tabindex = 0;
  tabView = false;

  setFlag: boolean;


  constructor(private createOfferService: CreateOfferService) {
  }
  toggleFilter: boolean = false;
  ngOnInit() {
    this.setFlag = true;
  }
  strategyReviewData = [
    {
      "functionaName": "CSPP",
      "approvalStatus": "Auto Approved",
      "approvedOn": "",
      "owner": ""
    },
    {
      "functionaName": "CPS",
      "approvalStatus": "Pending",
      "approvedOn": "9-Aug-2018",
      "owner": "John Thomas (FM)"
    },
    {
      "functionaName": "Compensation Ops",
      "approvalStatus": "Approved",
      "approvedOn": "5-Aug-2018",
      "owner": "Sean Parker(OPS)"
    },
    {
      "functionaName": "Royelty Team",
      "approvalStatus": "Conditionally Approved",
      "approvedOn": "4-Aug-2018",
      "owner": "Conditionally Approved"
    }
  ]

  show_deliveryDesc() {
    this.backdropCustom = true;
  }

  onSaveClick() {
    this.backdropCustom = false;
  }

  onCancelClick() {
    this.backdropCustom = false;
  }

}
