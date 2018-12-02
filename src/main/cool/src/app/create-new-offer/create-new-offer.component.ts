import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { CreateOfferService } from '../services/create-offer.service';

const searchOptions = ['Option1','Option2', 'Option3', 'Option4' ];
@Component({
  selector: 'app-create-new-offer',
  templateUrl: './create-new-offer.component.html',
  styleUrls: ['./create-new-offer.component.css']
})
export class CreateNewOfferComponent implements OnInit {

  search = (text$: Observable<string>) =>
  text$
    .debounceTime(200)
    .distinctUntilChanged()
    .map(term => term.length < 0 ? []
      : searchOptions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  backdropCustom=false;

  reqType='state';


  offerData = {
    "offname": this.createOfferService.coolOffer.offerName,
    "desc": this.createOfferService.coolOffer.offerDesc,
    "launch_date": new Date(this.createOfferService.coolOffer.expectedLaunchDate),
    "busunit": this.createOfferService.coolOffer.businessUnit,
    "busentity": this.createOfferService.coolOffer.businessEntity
  }
  tabindex = 0;
  tabView = false;

  panels = {
    "panel1": true,
    "panel2": true
  }

  userPanels = {
    "panel1": false,
    "panel2": true
  }

  dotBox=[
    {
      status:"Completed",
      statuscontent:"Initial MM Assesment"
    },
    {
     status:"Completed",
     statuscontent:"Initial offer Dimension"
   }
   ,
    {
     status:"In Progress",
     statuscontent:"Stakeholders Identified"
   },
   {
    status:"Completed",
    statuscontent:"Offer Portfolio"
  },
   {
    status:"In Progress",
    statuscontent:"Strategy Review Completion"
  },
  {
   status:"Pending",
   statuscontent:"Offer Construct Details"
 }
  ]

  resultTable=[
    {
      name:'Mary Adams',
      id:'madams@altus.com',
      function:'Pricing'
    },
    {
      name:'Gina Silva',
      id:'gsilva@altus.com',
      function:'Finance'
    },
    {
      name:'Derek Brian',
      id:'dbrian@altus.com',
      function:'Pricing'
    },
  ]

  setFlag: boolean;


  constructor(private createOfferService: CreateOfferService) { 
  }
  toggleFilter:boolean = false;
  ngOnInit() {
    this.setFlag = true;
  }
  strategyReviewData = [
    {
      "functionaName": "CSPP",
      "approvalStatus": "Auto Approved",
      "approvedOn":   "",
      "owner": ""
    },
    {
      "functionaName": "CPS",
      "approvalStatus": "Pending",
      "approvedOn":   "9-Aug-2018",
      "owner": "John Thomas (FM)"
    },
    {
      "functionaName": "Compensation Ops",
      "approvalStatus": "Approved",
      "approvedOn":   "5-Aug-2018",
      "owner": "Sean Parker(OPS)"
    },
    {
      "functionaName": "Royelty Team",
      "approvalStatus": "Conditionally Approved",
      "approvedOn":   "4-Aug-2018",
      "owner": "Conditionally Approved"
    }
  ]

  show_deliveryDesc(){
    this.backdropCustom=true;
   }

  onSaveClick(){
    this.backdropCustom=false;
  }

  onCancelClick(){
    this.backdropCustom=false;
  }

}
