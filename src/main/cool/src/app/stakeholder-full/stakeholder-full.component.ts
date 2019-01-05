import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SharedServiceService } from '../shared-service.service';
import { Subscription } from 'rxjs/Subscription';
import { CreateOfferService } from '../services/create-offer.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCollaboratorService } from '../services/search-collaborator.service';
import { AddEditCollaborator } from '../create-offer-cool/add-edit-collaborator';
import { StakeHolder } from '../models/stakeholder';
import { StakeHolderDTO } from '../models/stakeholderdto';
import { Collaborators } from '../models/collaborator';
import { MonetizationModelService } from '../services/monetization-model.service'
import { DataScroller } from 'primeng/primeng';

import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { MenuItem } from 'primeng/components/common/menuitem';

import { StakeholderfullService } from '../services/stakeholderfull.service';
import { ok } from 'assert';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { BupmGuard } from '../auth/gaurds/bupm-guard';
import {OfferPhaseService} from '../services/offer-phase.service';
//import { runInThisContext } from 'vm';

@Component({
  selector: 'app-stakeholder-full',
  templateUrl: './stakeholder-full.component.html',
  styleUrls: ['./stakeholder-full.component.css']
})
export class StakeholderFullComponent implements OnInit {

   entityList;
   notiFication: boolean = false;
   @Input() portfolioFlag: boolean = false;
   @Input() stakeData: Object;
   @Input() offerOwner: String;
   @Output() updateStakeData = new EventEmitter<string>();
   stakeholderForm:FormGroup;
   collaboratorsList;
   selectedCollabs;
   currentOfferId;
   temporaryList;
   lists;
   message = {};
   public offerBuilderdata;
   public newData:any[];
    //new update
    public showDelete =false;
    public tempcoll:any[];
    public lstcoll:any[];
    public showtemp:boolean;
    public showdel:boolean;
    public tempvalue:boolean;
    public lastvalue:boolean;
    public coll:any[];
    public selectedColl:any[];
    public firstData:any
    public data:any[];

   test:any;
    duplicateList: any;
    displayData: any;
  funcionalRoleList: string[];
  temporaryselectedCollabs: any[];
  finalCollabs: any[];


  newDatastring: string;
  deleteCollabs: any[];
  caseId: any;


  constructor( private stakeholderfullService:StakeholderfullService ,
     private createOfferService:CreateOfferService,
     private searchCollaboratorService:SearchCollaboratorService ,
     private activatedRoute: ActivatedRoute,
     private router:Router, private offerPhaseService:OfferPhaseService) {

        this.activatedRoute.params.subscribe(params => {
            this.currentOfferId = params['id'];
          });
          if (!this.currentOfferId) {
            this.currentOfferId = this.createOfferService.coolOffer.offerId
          }
          this.activatedRoute.params.subscribe(params => {
            this.currentOfferId = params['id'];
            this.caseId = params['id2'];
          });
      

}



datas= [
  {
      "_id": "jbondre",
      "businessEntity": "IOT",
      "functionalRole": "BUPM",
      "offerRole": "Reviewer",
      "stakeholderDefaults": false
  },
  {
      "_id": "jagondal",
      "businessEntity": "All",
      "functionalRole": "CPS",
      "offerRole": "Reviewer",
      "stakeholderDefaults": true
  }
]




   ngOnInit() {

    
    
    
    this.newData=[];
    this.temporaryselectedCollabs = [];
    this.deleteCollabs = [];
     //this.stakeholderfullService.getdata().subscribe(data=>{
      this.stakeholderfullService.getdata( this.currentOfferId).subscribe(data=>{
        this.firstData=data;
       this.data=this.firstData.stakeholders;
     console.log("data",typeof(this.data));
     
      console.log("Data::::"+(JSON.stringify(this.firstData)));
    });
    this.createOfferService.getPrimaryBusinessUnits()
    .subscribe(data => {
      console.log("create offer Service "+data);
      // this.entityList = data.businessUnits;
      this.entityList = ['Security', 'IOT', 'Data Center', 'Enterprise'];
        this.funcionalRoleList = ['BUPM','SOE'];
      console.log("create offer service"+ this.entityList);
    });
    this.stakeholderForm = new FormGroup({
        name: new FormControl(null, Validators.required),
        businessEntity: new FormControl(null, Validators.required),
        functionName: new FormControl(null, Validators.required)
      });


    this.showtemp=false;
    this.tempcoll=[];
    this.lstcoll=[];
    this.lastvalue=false;
    this.tempvalue=true;
   }

  //  selectList(event){
  //      this.showtemp=false;
  //      this.showdel=false;
  //      if(this.tempvalue==true){
  //          this.tempcoll=this.selectedColl;
  //      }
  //      if(this.lastvalue == true){
  //          this.lstcoll=this.selectedColl;
  //          console.log('lstcoll',this.lstcoll);
  //      }
  //  }

   getUserIdFromEmail(email): any {
    var arrayOfStrings = email.split('@');
    return arrayOfStrings[0];
  }

  
  updateMessage(message) {
 
    if (message != null && message !== "") {
      if (message == 'hold') {
        this.message = { contentHead: "", content: "The Offer has been placed on hold. All the stakeholders will be notified about the update status of the Offer.", color: "black" };
      } else if (message == 'cancel') {
        this.message = { contentHead: "", content: "The Offer has been cancelled. All the stakeholders will be notified about the update status of the Offer.", color: "black" };
      }
    }
  }


  onSearch() {
    let tempCollaboratorList: Collaborators[] = [];

    const userName = this.stakeholderForm.controls['name'].value;
    const businessEntity = this.stakeholderForm.controls['businessEntity'].value;
    const functionalRole = this.stakeholderForm.controls['functionName'].value;

    const payLoad = {
    };

    if (userName !== undefined && userName != null) {
      payLoad['userName'] = userName;
    }

    if (businessEntity !== undefined && businessEntity != null) {
      payLoad['userMappings'] = [{
        'businessEntity': businessEntity
      }];
    }

    if (functionalRole !== undefined && functionalRole != null) {
      payLoad['userMappings'] = [{
        'functionalRole': functionalRole
      }];
    }

    if ((businessEntity !== undefined && businessEntity != null) &&
      (functionalRole !== undefined && functionalRole != null)) {
      payLoad['userMappings'] = [{
        'businessEntity': businessEntity,
        'functionalRole': functionalRole
      }];
    }

    console.log("payload",payLoad);

    this.searchCollaboratorService.searchCollaborator(payLoad)
      .subscribe(data => {
        data.forEach(element => {
          console.log("coll",element);
          const collaborator = new Collaborators();
          collaborator._id = element._id;
          collaborator.email = element.emailId;
          collaborator.name = element.userName;
          collaborator.functionalRole = element.userMappings[0].functionalRole;
          collaborator.businessEntity = element.userMappings[0].businessEntity;

          element.userMappings[0].appRoleList.forEach(appRole => {
            collaborator.applicationRole.push(appRole);
          });
          console.log(collaborator.applicationRole);
          collaborator.offerRole = collaborator.applicationRole[0];

          tempCollaboratorList.push(collaborator);
        });
        this.collaboratorsList = tempCollaboratorList;
        console.log("collabarate list from backend",this.collaboratorsList);
      },
        error => {
          console.log('error occured');
          alert('Sorry, but something went wrong.')
          this.collaboratorsList = [];
        });
  }

  addToStakeData(res) {
    console.log(res);
    let keyUsers = res['stakeholders'];
    keyUsers.forEach(user => {
      if (this.stakeData[user['offerRole']] == null) {
        this.stakeData[user['offerRole']] = [];
      }
      this.stakeData[user['offerRole']].push({ name: user['_id'], email: "sample@sample.com" });
    })
  }

  addCollaborator() {
    console.log("finalcolabrattiondata::::::",this.data);
     const listOfStakeHolders: StakeHolder[] = [];
     let stakeholdersPayLoad={
       offerId:this.currentOfferId,
       caseId:this.caseId,
       stakeholders:[]
     }
     this.data.forEach(element=>{
      let obj={
        "_id" : element._id, 
        "businessEntity" :element.businessEntity, 
        "functionalRole" : element.functionalRole, 
        "stakeholderDefaults" : false
       }
       stakeholdersPayLoad['stakeholders'].push(obj);

     })
     console.log("stakeholdersPayLoad",stakeholdersPayLoad);
     
     
     this.stakeholderfullService.getOfferBuilderData(this.currentOfferId).subscribe(data=>{
         this.offerBuilderdata=data;
         console.log("offerOwner",this.offerBuilderdata);
     });

     

     this.stakeholderfullService.proceedToStrageyReview(stakeholdersPayLoad).subscribe(data=>{
      let proceedPayload = {
            "taskId": "",
             "userId": this.offerBuilderdata['offerOwner'],
            "caseId": this.caseId,
            "offerId": this.currentOfferId,
            "taskName": "Stake Holders", 
            "action": "",
            "comment": ""
          };
          this.offerPhaseService.proceedToStakeHolders(proceedPayload).subscribe(result => {
            this.router.navigate(['/strategyReview', this.currentOfferId,this.caseId]);
           })
     })
    

  }
  

  gotoMMpage(){
    this.router.navigate(['/mmassesment',this.currentOfferId,this.caseId]);
  }
  onDelete(user){debugger;
    if(this.data.length == 1){
      this.data.splice(0, 1);
    }
    for(let i=0;i<= this.data.length -1;i++){
      if(this.data[i]._id === user._id){
        this.data.splice(i,1);
      }
    }
    this.finalCollabs = this.data;
    console.log("finaldata",this.data);
    
}
  onEvent(event,value){
    this.showDelete =true;
  
  }
  onOut(event,value){
    this.showDelete =false;
  }
  selectlist(event){debugger;
  // this.temporaryselectedCollabs = this.selectedCollabs;
     if( this.selectedCollabs.length < 1){
       this.temporaryselectedCollabs.push(this.selectedCollabs);
     }


 if(this.selectedCollabs.length > 0 && this.data.length  > 0){
    this.selectedCollabs.forEach(element => {
      if( this.data.includes(element)){
        alert("User already selected -- select ok to delete the user");
        this.selectedCollabs.pop();
        this.deleteCollabs.push(element);
      } else{
       
        this.temporaryselectedCollabs.push(element);
    }
  });
}
  
   

  }

  addselectedCollabs(){debugger;
    if(this.temporaryselectedCollabs.length>0 &&this.newData.length  >0 ){
    //  this.newData = this.newData.concat(this.temporaryselectedCollabs);
      this.data = this.data.concat(this.temporaryselectedCollabs);
      console.log("newdatsa",this.data);
      this.finalCollabs = this.newData;
      console.log("newdata",typeof(this.newData));
      }
    if(this.temporaryselectedCollabs.length>0 && this.newData.length <1){
    this.newData = this.temporaryselectedCollabs;
    this.finalCollabs = this.newData;
    this.data= this.data.concat(this.newData);
    console.log("newdatsa",this.data);
    console.log("newdata",typeof(this.newData));
    this.newDatastring  = JSON.stringify(this.newData);
    }
    if(this.temporaryselectedCollabs.length < 1){
      alert("select atleast one");
    }
   
    console.log("newDatalist",this.newData[0]);

    this.temporaryselectedCollabs = [];
    this.selectedCollabs = [];

  }

  multideleteCollaborator(){
    debugger;
    if(this.deleteCollabs.length < 1){
      alert("select atleast one");
    }
  
    if(this.deleteCollabs.length > 0){
  
    

        this.data = this.data.filter(val => !this.deleteCollabs.includes(val));
          }
    
       this.finalCollabs = this.data;
       this.deleteCollabs = [];
       this.selectedCollabs = [];
     }

  //  if(this.temporaryselectedCollabs.length>0){
  //   for( var i=0;i<this.temporaryselectedCollabs.length;i++){
  //       var arrlen=this.data.length;
  //       for(var j=0;j<arrlen;j++){
  //           if(this.temporaryselectedCollabs[i]==this.data[j]){
  //               this.multideleteCollaboratordata=this.data.slice(0,j).concat(this.data.slice(j+1,arrlen));
  //           }
  //       }
  //   }
  //}
 



   getInitialChar(name) {
    if (name == null) return ""
    let names = name.split(' ');
    let initials = "";
    initials += names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      initials += names[1].charAt(0).toUpperCase();
    }
    return initials;
  }

}
