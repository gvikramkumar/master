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

@Component({
  selector: 'app-stakeholder-full',
  templateUrl: './stakeholder-full.component.html',
  styleUrls: ['./stakeholder-full.component.css']
})
export class StakeholderFullComponent implements OnInit {
   public data;
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
    //new update
    public tempcoll:any[];
    public lstcoll:any[];
    public showtemp:boolean;
    public showdel:boolean;
    public tempvalue:boolean;
    public lastvalue:boolean;
    public coll:any[];
    public selectedColl:any[];

   test:any;
    duplicateList: any;
    displayData: any;

  constructor( private stakeholderfullService:StakeholderfullService ,
     private createOfferService:CreateOfferService,
     private searchCollaboratorService:SearchCollaboratorService ,
     private activatedRoute: ActivatedRoute,) { 

        this.activatedRoute.params.subscribe(params => {
            this.currentOfferId = params['id'];
          });
          if (!this.currentOfferId) {
            this.currentOfferId = this.createOfferService.coolOffer.offerId
          }
  
  
}
 
  
  

   ngOnInit() { 

     this.stakeholderfullService.getdata().subscribe(data=>{ 
       this.data=data;
      console.log("Data::::"+this.data);
    });
    this.createOfferService.getPrimaryBusinessUnits() 
    .subscribe(data => {
      console.log("create offer Service "+data);
      this.entityList = data.businessUnits;
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

   selectList(event){
       this.showtemp=false;
       this.showdel=false;
       if(this.tempvalue==true){
           this.tempcoll=this.selectedColl;
       }
       if(this.lastvalue == true){
           this.lstcoll=this.selectedColl;
           console.log('lstcoll',this.lstcoll);
       }
   }

   getUserIdFromEmail(email): any {
    var arrayOfStrings = email.split('@');
    return arrayOfStrings[0];
  }


   onSearch() {

    console.log(this.stakeholderForm.value);
    let tempCollaboratorList: Collaborators[] = [];
    const searchCollaborator: AddEditCollaborator = new AddEditCollaborator(
      this.stakeholderForm.controls['name'].value,
      this.stakeholderForm.controls['businessEntity'].value,
      this.stakeholderForm.controls['functionName'].value);
      
    this.searchCollaboratorService.searchCollaborator(searchCollaborator)
      .subscribe(data => {
        data.forEach(element => {
          let collaborator = new Collaborators();
          collaborator.applicationRole = element.applicationRole;
          collaborator.businessEntity = element.businessEntity;
          collaborator.email = element.email;
          collaborator.functionalRole = element.functionalRole;
          collaborator.name = element.name;
          collaborator.offerRole = element.applicationRole[0]; 
          tempCollaboratorList.push(collaborator);
        });
        this.collaboratorsList = tempCollaboratorList;
      },
        error => {
          console.log('error occured');
          alert("Sorry, but something went wrong.")
          this.collaboratorsList = [];
         });
  }


onselectCollaboratorsList(_id){
   this.collaboratorsList.forEach(element=>{
      if(_id==element._id){
          if(this.temporaryList.length==0){
              this.temporaryList.push(element)
              this.test=1;
              console.log("temporary list"+ this.temporaryList[0].userName);
          }
          else{
              this.onDuplicateHandler(element);
          }
      }
       })
}
onDuplicateHandler(element){
    if(this.temporaryList.includes(element)){
    this.duplicateList.push(element);
    this.test=1;
    }
    else{
        this.temporaryList.push(element);
        this.test=1;
    }
}


addAll(){
 this.showtemp=true;
 this.selectedColl=[];
 this.lastvalue=true;
 this.showdel=false;
 this.tempvalue=false;
}
multideleteCollaborator(){
console.log("lstcoll",this.lstcoll);
console.log("tempcoll",this.tempcoll);
if(this.lstcoll.length>0){
    for( var i=0;i<this.lstcoll.length;i++){
        var arrlen=this.tempcoll.length;
        for(var j=0;j<arrlen;j++){
            if(this.lstcoll[i]==this.tempcoll[j]){
                this.tempcoll=this.tempcoll.slice(0,j).concat(this.tempcoll.slice(j+1,arrlen));
            }
        }
    }
    this.showdel=true;
    this.showtemp=false;
    this.data=this.tempcoll;
    this.selectedColl=[];
    this.tempvalue=true;
}


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
    const listOfStakeHolders: StakeHolder[] = [];
    const stakeHolderDto = new StakeHolderDTO();


    stakeHolderDto.offerId = this.currentOfferId;
   // stakeHolderDto.stakeholders = listOfStakeHolders;
   stakeHolderDto.stakeholders = this.data;
    console.log(stakeHolderDto);
    console.log('before service call');
    let that = this;
    this.searchCollaboratorService.addCollaborators(stakeHolderDto).subscribe(data => {
      // update (data);
    });
    // this.updateStakeData.next("");stakeData from data posted response
      that.addToStakeData
   // this.display  = false;

  }

 

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
