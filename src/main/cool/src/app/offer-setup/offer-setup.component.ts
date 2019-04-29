import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/services/message.service';
import { UserService } from '../shared/services/user.service';
import { OfferSetupService } from '../services/offer-setup.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';

@Component({
  selector: 'app-offer-setup',
  templateUrl: './offer-setup.component.html',
  styleUrls: ['./offer-setup.component.scss']
})
export class OfferSetupComponent implements OnInit {
  stake;
  offerId;
  caseId;
  setFlag;
  message;
  offerName;
  offerData;
  stakeData;
  derivedMM;
  moduleStatus;
  stakeHolderData;
  groupData = {};
  primaryBE: string;
  stakeHolderInfo: any;
  offerBuilderdata = {};
  displayLeadTime = false;
  noOfWeeksDifference: string;
  functionalRole: any;
  backbuttonStatusValid = true;
  proceedButtonStatusValid = true;
  proceedToreadinessreview = true;
  Options: any[] = [];

  


  constructor(private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private offerSetupService: OfferSetupService,
    private rightPanelService:RightPanelService,
    private stakeholderfullService:StakeholderfullService ) {
    this.activatedRoute.params.subscribe(params => {
      this.offerId = params['id'];
      this.caseId = params['id2'];
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

  // Get All the ModuleName and place in order
    this.offerSetupService.getModuleData(this.derivedMM,this.offerId,this.functionalRole).subscribe(data => {
      this.Options =data['listATOs'];
      data['listSetupDetails'].forEach(group => {

        this.getModuleStatus(group);
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
    });

   

   

   


  }

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
 this.offerSetupService.getModuleStatus(group['moduleName'],this.offerId,this.functionalRole,this.derivedMM).subscribe(data => {
  group['status'] = data['message'];

});
  }

  private processStakeHolderInfo() {

    const stakeHolderBasedOnOfferRole = {};
    const stakeHolderBasedOnFunctionalRole = {};

    for (let i = 0; i <= this.stakeHolderData.length - 1; i++) {
      if (stakeHolderBasedOnOfferRole[this.stakeHolderData[i]['offerRole']] == null) {
        stakeHolderBasedOnOfferRole[this.stakeHolderData[i]['offerRole']] = [];
      }
      stakeHolderBasedOnOfferRole[this.stakeHolderData[i]['offerRole']].push({
        userName: this.stakeHolderData[i]['name'],
        emailId: this.stakeHolderData[i]['_id'] + '@cisco.com',
        _id: this.stakeHolderData[i]['_id'],
        businessEntity: this.stakeHolderData[i]['businessEntity'],
        functionalRole: this.stakeHolderData[i]['functionalRole'],
        offerRole: this.stakeHolderData[i]['offerRole'],
        stakeholderDefaults: this.stakeHolderData[i]['stakeholderDefaults']
      });
    }

    for (let i = 0; i <= this.stakeHolderData.length - 1; i++) {
      if (stakeHolderBasedOnFunctionalRole[this.stakeHolderData[i]['functionalRole']] == null) {
        stakeHolderBasedOnFunctionalRole[this.stakeHolderData[i]['functionalRole']] = [];
      }
      stakeHolderBasedOnFunctionalRole[this.stakeHolderData[i]['functionalRole']].push({
        userName: this.stakeHolderData[i]['name'],
        emailId: this.stakeHolderData[i]['_id'] + '@cisco.com',
        _id: this.stakeHolderData[i]['_id'],
        businessEntity: this.stakeHolderData[i]['businessEntity'],
        functionalRole: this.stakeHolderData[i]['functionalRole'],
        offerRole: this.stakeHolderData[i]['offerRole'],
        stakeholderDefaults: this.stakeHolderData[i]['stakeholderDefaults']
      });
    }

    this.stakeData = stakeHolderBasedOnOfferRole;
    this.stake = stakeHolderBasedOnFunctionalRole;

  }

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

  getElementDetails(element) {
    console.log('cuurent elemenrt', element);
    element.moduleName = element.moduleName.replace(/\s/g, "");
    this.router.navigate(['/' + element.moduleName]);
    // this.router.navigate(['/' + element.moduleName, this.offerId]);
  }


}