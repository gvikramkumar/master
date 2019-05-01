import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/services/message.service';
import { OfferSetupService } from '../../services/offer-setup.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { UserService } from '@app/core/services/user.service';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';

@Component({
  selector: 'app-offer-setup',
  templateUrl: './offer-setup.component.html',
  styleUrls: ['./offer-setup.component.scss']
})
export class OfferSetupComponent implements OnInit {
  offerId;
  caseId;
  setFlag;
  message;
  offerName;
  offerData;

  derivedMM;
  moduleStatus;
  functionalRole;

  stakeHolderData;
  stakeholders: any;

  groupData = {};
  primaryBE: string;
  stakeHolderInfo: any;
  offerBuilderdata = {};
  displayLeadTime = false;
  noOfWeeksDifference: string;
  backbuttonStatusValid = true;
  proceedButtonStatusValid = true;
  proceedToreadinessreview = true;
  Options: any[] = [];
  selectedOffer:any = 'Overall Offer';
  selectedAto:string = 'Overall Offer';

  


  constructor(private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private offerSetupService: OfferSetupService,
    private rightPanelService:RightPanelService,
    private stakeholderfullService:StakeholderfullService ) {
    this.activatedRoute.params.subscribe(params => {
      this.offerId = params['offerId'];
      this.caseId = params['caseId'];
    });
   }

  ngOnInit() {

  //  =======================================================================================
  this.functionalRole = this.userService.getFunctionalRole();
   // Get Offer Details
   this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(offerDetails => {
     
    this.offerBuilderdata = offerDetails;
    this.offerBuilderdata['BEList'] = [];
    this.offerBuilderdata['BUList'] = [];
    if (this.offerBuilderdata['primaryBEList'] != null) {
      this.offerBuilderdata['BEList'] = this.offerBuilderdata['BEList'].concat(this.offerBuilderdata['primaryBEList']);
    }
    if (this.offerBuilderdata['secondaryBEList'] != null) {
      this.offerBuilderdata['BEList'] = this.offerBuilderdata['BEList'].concat(this.offerBuilderdata['secondaryBEList']);
    }
    if (this.offerBuilderdata['primaryBUList'] != null) {
      this.offerBuilderdata['BUList'] = this.offerBuilderdata['BUList'].concat(this.offerBuilderdata['primaryBUList']);
    }
    if (this.offerBuilderdata['secondaryBUList'] != null) {
      this.offerBuilderdata['BUList'] = this.offerBuilderdata['BUList'].concat(this.offerBuilderdata['secondaryBUList']);
    }

    this.derivedMM = offerDetails['derivedMM'];
    this.offerName = offerDetails['offerName'];
    this.stakeHolderData = offerDetails['stakeholders'];

    if (Array.isArray(offerDetails['primaryBEList']) && offerDetails['primaryBEList'].length) {
      this.primaryBE = offerDetails['primaryBEList'][0];
    }

    
    // TTM Info
    this.rightPanelService.displayAverageWeeks(this.primaryBE, this.derivedMM).subscribe(
      (leadTime) => {
        this.noOfWeeksDifference = Number(leadTime['averageOverall']).toFixed(1);
        this.displayLeadTime = true;
      },
      () => {
        this.noOfWeeksDifference = 'N/A';
      }
    );

    // Populate Stake Holder Info
    this.processStakeHolderInfo();
  });

  // for refresh

  this.getAllModuleData();
 interval(9000000).subscribe(x =>
  this.getAllModuleData()
 ) 


  }


   // Get All the ModuleName and place in order
   getAllModuleData() {this.offerSetupService.getModuleData(this.derivedMM,this.offerId,this.functionalRole).subscribe(data => {
     this.groupData = {};
    this.Options =data['listATOs'];
    debugger;
    data['listSetupDetails'].forEach(group => {

      // this.getModuleStatus(group);
      let groupName = group['groupName']
      if (this.groupData[groupName] == null) {
        this.groupData[groupName] = {'left': [], 'right': []};
      }
      if (group['colNum'] == 1) {
        this.groupData[groupName]['left'].push(group);
      } else {
        this.groupData[groupName]['right'].push(group);
      }
      
    });
    this.sortGroupData();
  }
  );
}
// sort the module location
  sortGroupData() {
    this.groupData['Group3']['left'].sort(
      (a,b) => (a.rowNum > b.rowNum) ? 1 : ((b.rowNum > a.rowNum) ? -1 : 0)
      );
    this.groupData['Group3']['right'].sort(
        (a,b) => (a.rowNum > b.rowNum) ? 1 : ((b.rowNum > a.rowNum) ? -1 : 0)
      );
  }
  
// Get Status For Each Module
  getModuleStatus(group) {
 this.offerSetupService.getModuleStatus(group['moduleName'],this.selectedOffer,this.offerId,this.functionalRole,this.derivedMM).subscribe(data => {
  group['status'] = data['message'];

});
  }

  // get stakeHolder information
  private processStakeHolderInfo() {

    this.stakeholders = {};

    for (let i = 0; i <= this.stakeHolderData.length - 1; i++) {
      if (this.stakeholders[this.stakeHolderData[i]['offerRole']] == null) {
        this.stakeholders[this.stakeHolderData[i]['offerRole']] = [];
      }
      this.stakeholders[this.stakeHolderData[i]['offerRole']].push({
        userName: this.stakeHolderData[i]['name'],
        emailId: this.stakeHolderData[i]['_id'] + '@cisco.com',
        _id: this.stakeHolderData[i]['_id'],
        businessEntity: this.stakeHolderData[i]['businessEntity'],
        functionalRole: this.stakeHolderData[i]['functionalRole'],
        offerRole: this.stakeHolderData[i]['offerRole'],
        stakeholderDefaults: this.stakeHolderData[i]['stakeholderDefaults']
      });
    }
  }
// update message for humburger
  updateMessage(message) {
    if (message != null && message !== '') {
      if (message === 'hold') {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = { contentHead: '', content: 'The Offer has been placed on hold. All the stakeholders will be notified about the update status of the Offer.', color: 'black' };
      } else if (message === 'cancel') {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = { contentHead: '', content: 'The Offer has been cancelled. All the stakeholders will be notified about the update status of the Offer.', color: 'black' };
      }
    }
  }



  onProceedToNext(){}
  selectedValue(event) {
    // console.log('evemnt', event);
    // console.log('selectedAto', this.selectedAto);
  }
  getElementDetails(element) {
    let moduleName = element.moduleName.replace(/\s/g, "");
    // this.router.navigate(['/' + element.moduleName]);
    // this.router.navigate(['/' + element.moduleName, this.offerId]);
    // this.router.navigate(['/', + moduleName]);
    this.router.navigate(['/ItemCreation', this.offerId, this.caseId, this.selectedAto]);
  }

  updateModuleData(message) {
    this.getAllModuleData();
  }
}