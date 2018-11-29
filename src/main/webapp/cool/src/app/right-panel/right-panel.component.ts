import { Component, OnInit, Input } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SharedServiceService } from '../shared-service.service';
import { Subscription } from 'rxjs/Subscription';
import { CreateOfferService } from '../services/create-offer.service';

const searchOptions = ['Option1','Option2', 'Option3', 'Option4' ];
@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css']
})
export class RightPanelComponent implements OnInit {

  notiFication:boolean=false;
  @Input() portfolioFlag:boolean=false;
  backdropCustom:boolean=false;
  proceedFlag:boolean;
  subscription:Subscription;
  aligned:boolean;
  currentOfferId;
  phaseTaskMap:object;
  phaseList:string[];
  search = (text$: Observable<string>) =>
  text$
    .debounceTime(200)
    .distinctUntilChanged()
    .map(term => term.length < 0 ? []
      : searchOptions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

      ddFunction = "Select Function";
      flagFunction = false;
    
      ddOwner1 = "Select Owner";
      flagOwner1 = false;
    
      ddOwner2 = "Select Owner";
      flagOwner2 = false;
    
      ddOwner3 = "Select Owner";
      flagOwner3 = false;
  
    offerData;
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

  OfferOwners;
  approvars;


  userPanels = {
    "panel1": false,
    "panel2": true
  }

  constructor( private activatedRoute:ActivatedRoute,
       private router: Router,
      private createOfferService: CreateOfferService,) {
        this.activatedRoute.params.subscribe(params => {
          this.currentOfferId = params['id'];
        });
        if(!this.currentOfferId){
          this.currentOfferId = this.createOfferService.coolOffer.offerId
        }
       }

  ngOnInit() {
    if(this.currentOfferId){
      this.createOfferService.getMMMapperById(this.currentOfferId).subscribe( data => {
        this.createOfferService.subscribeMMAssessment(data);
        this.offerData = data;
        this.OfferOwners = this.offerData.offerObj.owners;
        this.approvars=this.offerData.offerObj.approvars;

        this.phaseTaskMap = this.offerData.phaseTaskList;

        this.phaseList = Object.keys(this.phaseTaskMap);

        Object.keys(this.phaseTaskMap).forEach(phase => {
            console.log(phase);
        })

        if(this.OfferOwners){
          this.OfferOwners.forEach(item =>{
            item.caption ="";
            item.caption = item.firstName.charAt(0)+""+item.lastName.charAt(0)
         })
        }
        if(this.approvars){
          this.approvars.forEach(item =>{
            item.caption ="";
            item.caption = item.firstName.charAt(0)+""+item.lastName.charAt(0)
          })
        }
      })
    }
  }

  show_deliveryDesc(){
    this.backdropCustom=true;
   }

   onSaveClick(){
    this.backdropCustom=false;
    this.notiFication=true;
    setTimeout(() => {
      this.notiFication=false;
    },3000);
  }

  onCancelClick(){
    this.backdropCustom=false;
  }

  onOfferClick(){
    this.portfolioFlag=true;
    this.router.navigate(['/coolOffer']);
   
  }
  onProceedBtnClicked(){

    this.createOfferService._coolOfferSubscriber.subscribe(data => {
      this.offerData = data;
     });

     if(this.offerData.offerObj.mmMapperStatus == 'Not Aligned') {

      alert('Status is \'Not Aligned\'!. You cannot proceed with stakeholder identification.');
      
     } else {

      document.location.href="http://owb1-stage.cloudapps.cisco.com/owb/owb/showHome#/manageOffer/editPlanReview/"+this.currentOfferId;

    }

    

   

  }
}
