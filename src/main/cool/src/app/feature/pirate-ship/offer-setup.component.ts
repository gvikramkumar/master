import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '@app/core/services/user.service';
import { MessageService } from '@app/services/message.service';
import { OfferSetupService } from '@app/services/offer-setup.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';

import { appRoutesNames } from '@app/app.routes.names';
import { pirateShipRoutesNames } from './pirate-ship.routes.names';

import { interval } from 'rxjs';
import { ActionsService } from '@app/services/actions.service';

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

  showMM: boolean = false;
  readOnly: boolean = false;
  derivedMM;
  moduleStatus;
  functionalRole;

  stakeHolderData = [];
  stakeholders: any;

  groupData = {};
  showGroupData: boolean = false;
  primaryBE: string;
  stakeHolderInfo: any;
  offerBuilderdata = {};
  displayLeadTime = false;
  noOfWeeksDifference: string;
  backbuttonStatusValid = true;
  proceedButtonStatusValid = true;
  proceedToreadinessreview = true;
  Options: any[] = [];
  selectedOffer: any = 'Overall Offer';
  selectedAto: string = 'Overall Offer';
  designReviewComplete: Boolean = false;



  constructor(private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private offerSetupService: OfferSetupService,
    private rightPanelService: RightPanelService,
    private stakeholderfullService: StakeholderfullService,
    private actionsService: ActionsService) {
    this.activatedRoute.params.subscribe(params => {
      this.offerId = params['offerId'];
      this.caseId = params['caseId'];
      if (params['selectedAto']) {
        this.selectedAto = params['selectedAto'];
      }
    });
  }

  ngOnInit() {

    //  =======================================================================================
    this.functionalRole = this.userService.getFunctionalRole();

    this.offerSetupService.lockAPIForOWB(this.offerId).subscribe(res=> {
    });
    // Check design review status for enabling Item Creation Module
    this.actionsService.getMilestones(this.caseId).subscribe(data => {
      data['plan'].forEach(element => {
        if (element['subMilestone'] === 'Design Review' && element['status'] === 'Completed') {
          this.designReviewComplete = true;
        }
      });
    });

    // Get Offer Details
    this.getOfferDetails();



    // for refresh
    interval(9000000).subscribe(x =>
      this.getAllModuleData()
    )


  }

  // Get offer Details

  getOfferDetails() {

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

      // Get Module Name and Status
      this.getAllModuleData();

      if (this.derivedMM !== 'Not Aligned') {
        this.showMM = true;
      }

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
  }

  // Get All the ModuleName and place in order
  getAllModuleData() {

    this.offerSetupService.getModuleData(this.offerId, this.selectedAto, this.functionalRole).subscribe(data => {

      this.groupData = {};
      this.showGroupData = false;
      this.Options = data['listATOs'];
      data['listSetupDetails'].forEach(group => {

        const groupName = group['groupName']
        if (this.groupData[groupName] == null) {
          this.groupData[groupName] = { 'left': [], 'right': [] };
        }
        if (group['colNum'] == 1) {
          this.groupData[groupName]['left'].push(group);
        } else {
          this.groupData[groupName]['right'].push(group);
        }

      });
      this.sortGroupData();
      this.showGroupData = true;
    }
    );
  }

  // sort the module location
  sortGroupData() {
    this.groupData['Group3']['left'].sort(
      (a, b) => (a.rowNum > b.rowNum) ? 1 : ((b.rowNum > a.rowNum) ? -1 : 0)
    );
    this.groupData['Group3']['right'].sort(
      (a, b) => (a.rowNum > b.rowNum) ? 1 : ((b.rowNum > a.rowNum) ? -1 : 0)
    );
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



  getElementDetails(element) {
    console.log(element.moduleName);
    /* if (element.moduleName === 'Item Creation') {
      this.router.navigate([appRoutesNames.PIRATE_SHIP, this.offerId, this.caseId, pirateShipRoutesNames.ITEM_CREATION, this.selectedAto]);
    } else if (element.moduleName === 'Modeling & Design') {
      this.router.navigate([appRoutesNames.PIRATE_SHIP, this.offerId, this.caseId, pirateShipRoutesNames.MODELLING_DESIGN, this.selectedAto]);
    } */

    switch (element.moduleName) {
      case 'Item Creation': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId, this.caseId,
        pirateShipRoutesNames.ITEM_CREATION,
        this.selectedAto]);
        break;
      }
      case 'Modeling & Design': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId,
        this.caseId,
        pirateShipRoutesNames.MODELLING_DESIGN,
        this.selectedAto]);
        break;
      }
      case 'Service Annuity  % Pricing': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId, this.caseId,
        pirateShipRoutesNames.SERVICE_ANNUITY_PRICING,
        this.selectedAto]);
        break;
      }
      case 'CSDL': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId,
        this.caseId,
        pirateShipRoutesNames.CSDL,
        this.selectedAto]);
        break;
      }
      case 'Term & Content Mapping': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId, this.caseId,
        pirateShipRoutesNames.TC_MAPPING,
        this.selectedAto]);
        break;
      }
      case 'NPI Licensing': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId,
        this.caseId,
        pirateShipRoutesNames.CHANGE_STATUS,
        this.selectedAto, element.moduleName]);

        break;
      }
      case 'Royalty Setup': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId,
        this.caseId,
        pirateShipRoutesNames.CHANGE_STATUS,
        this.selectedAto, element.moduleName]);

        break;
      }
      case 'Offer Attribution': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId,
        this.caseId,
        pirateShipRoutesNames.CHANGE_STATUS,
        this.selectedAto, element.moduleName]);

        break;
      }
      case 'Export Compliance': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId,
        this.caseId,
        pirateShipRoutesNames.CHANGE_STATUS,
        this.selectedAto, element.moduleName]);

        break;
      }
      case 'Test Orderability': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId,
        this.caseId,
        pirateShipRoutesNames.CHANGE_STATUS,
        this.selectedAto, element.moduleName]);

        break;
      }
      case 'Pricing Uplift Setup': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId,
        this.caseId,
        pirateShipRoutesNames.CHANGE_STATUS,
        this.selectedAto, element.moduleName]);

        break;
      }
      case 'Orderability': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId,
        this.caseId,
        pirateShipRoutesNames.SELF_SERVICE_ORDERABILITY,
        this.selectedAto]);
        break;
      }
      case 'Service Mapping': {
        this.router.navigate([appRoutesNames.PIRATE_SHIP,
        this.offerId,
        this.caseId,
        pirateShipRoutesNames.SERVICE_MAPPING,
        this.selectedAto]);
        break;
      }
    }
  }

  onProceedToNext() {
  }

  selectedValue(event) {
    this.getAllModuleData();
  }

}
