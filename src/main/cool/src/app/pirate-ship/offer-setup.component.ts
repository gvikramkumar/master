import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '@app/core/services/user.service';
import { MessageService } from '@app/services/message.service';
import { OfferSetupService } from '../services/offer-setup.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';

import { appRoutesNames } from '../app.routes.names';
import { pirateShipRoutesNames } from './pirate-ship.routes.names';

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

  showMM: boolean = false;
  derivedMM;
  moduleStatus;
  functionalRole:any = 'BUPM';

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
  selectedOffer: any = 'Overall Offer';
  selectedAto: string = 'Overall Offer';




  constructor(private router: Router,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private offerSetupService: OfferSetupService,
              private rightPanelService: RightPanelService,
              private stakeholderfullService: StakeholderfullService) {
    this.activatedRoute.params.subscribe(params => {
      this.offerId = params['offerId'];
      this.caseId = params['caseId'];
    });
  }

  ngOnInit() {

    //  =======================================================================================
    this.functionalRole = this.userService.getFunctionalRole();
    // Get Offer Details
    this.getOfferDetails();

    // Get Module Name and Status
    this.getAllModuleData();

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
    this.offerSetupService.getModuleData(this.derivedMM, this.offerId, this.functionalRole, this.selectedAto).subscribe(data => {
        this.groupData = {};

        this.Options = data['listATOs'];
        this.offerSetupService.setAtolist(this.Options);
        data['listSetupDetails'].forEach(group => {

          let groupName = group['groupName']
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
    switch (element.moduleName) {
      case 'Item Creation':
        this.router.navigate([appRoutesNames.PIRATE_SHIP, this.offerId, this.caseId, pirateShipRoutesNames.ITEM_CREATION, this.selectedAto]);
        break;
      case 'Modeling & Design':
        this.router.navigate([appRoutesNames.PIRATE_SHIP, this.offerId, this.caseId, pirateShipRoutesNames.MODELLING_DESIGN, this.selectedAto]);
        break;
      case 'Service Annuity  % Pricing':
        //  console.log(this.selectedAto);
        this.router.navigate([appRoutesNames.PIRATE_SHIP, this.offerId, this.caseId, pirateShipRoutesNames.SERVICE_ANNUITY_PRICING, this.selectedAto]);
        break;

    }
  }



  onProceedToNext() {
  }

  selectedValue(event) {
    this.getAllModuleData();
  }

}



