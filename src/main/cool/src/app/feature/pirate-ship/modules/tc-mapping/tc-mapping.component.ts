import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { LoaderService } from '@app/core/services/loader.service';
import { EnvironmentService } from '@env/environment.service';
import { ConfigurationService } from '@app/core/services/configuration.service';

import { RightPanelService } from '@app/services/right-panel.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { TcMappingService } from '@app/services/tc-mapping.service';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tc-mapping',
  templateUrl: './tc-mapping.component.html',
  styleUrls: ['./tc-mapping.component.css']
})
export class TcMappingComponent implements OnInit, OnDestroy {

  caseId: string;
  planId: string;
  offerId: string;
  offerName: string;
  offerOwner: string;
  functionalRole: Array<String>;

  primaryBE: string;
  derivedMM: string;
  displayLeadTime = false;
  noOfWeeksDifference: string;

  stakeholders: any;
  stakeHolderData: any;

  showCompleteSubscriptionButton: boolean;

  pirateShipModuleName: string;
  isPirateShipSubModule: boolean;

  selectedAto: any;
  atoNames: string[] = [];
  atoList: any;
  selectedObjectAto: any;
  selectedIndex: any;

  paramsSubscription: Subscription;


  constructor(
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private rightPanelService: RightPanelService,
    private environmentService: EnvironmentService,
    private configurationService: ConfigurationService,
    private stakeholderfullService: StakeholderfullService,
    private tncMapping : TcMappingService,
  ) { 
    this.paramsSubscription = this.activatedRoute.params.subscribe(params => {
      this.caseId = params['caseId'];
      this.offerId = params['offerId'];
      this.selectedAto = params['selectedAto'];
    });

    this.loaderService.startLoading();

    // Initialize TaskBar Params
    this.isPirateShipSubModule = true;
    this.pirateShipModuleName = ' T&C Subscription Mapping';
  }

  ngOnInit() {

    this.functionalRole = this.configurationService.startupData.functionalRole;
    this.showCompleteSubscriptionButton = this.selectedAto === 'Overall Offer' ? false : true;

    // Retrieve Offer Details
    this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(offerDetails => {

      this.planId = offerDetails['planId'];
      this.derivedMM = offerDetails['derivedMM'];
      this.offerName = offerDetails['offerName'];
      this.primaryBE = offerDetails['primaryBEList'][0];
      this.stakeHolderData = offerDetails['stakeholders'];

      this.processStakeHolderInfo();
      this.getLeadTimeCalculation();

    });
    this.atoList = [];
    this.tncMapping.getTncMapping(this.offerId).subscribe(atoList => {
      this.atoNames = ['Overall Offer'];
      this.selectedIndex = 0;
      this.atoList = atoList.data;
      for (let i = 0; i < this.atoList.length; i++) {
        this.atoNames.push(this.atoList[i].itemName);
        if (!this.atoList[i].hasOwnProperty('itemStatus') && this.atoList[i].hasOwnProperty('mappingStatus')) {
          this.atoList[i].itemStatus = this.atoList[i].mappingStatus;
        }
      }
      for (let j = 0; j < this.atoNames.length; j++) {
        if (this.atoNames[j] === this.selectedAto) {
          this.selectedIndex = j;
        }
      }
      this.showSelectedAtoView(this.selectedIndex);
    }, error => {
      console.log('error', error);
    });   
  }



  // -------------------------------------------------------------------------------------------------------------------




  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  // -------------------------------------------------------------------------------------------------------------------

  showSelectedAtoView(dropDownValue: any) {
    
    if (dropDownValue === 'Overall Offer' || dropDownValue === 0) {

      this.selectedAto = this.atoNames[dropDownValue];
      this.showCompleteSubscriptionButton = true;

    } else {

      this.selectedAto = this.atoNames[dropDownValue];
      this.showCompleteSubscriptionButton = true;

    }
    for (let i = 0; i < this.atoList.length; i++) {
      if (this.atoList[i].itemName === this.selectedAto && i === dropDownValue - 1) {
        this.selectedObjectAto = this.atoList[i];
      }
    }
  }

  // -------------------------------------------------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------------------------------------------------

  private getLeadTimeCalculation() {

    this.rightPanelService.displayAverageWeeks(this.primaryBE, this.derivedMM).subscribe((leadTime) => {

      this.noOfWeeksDifference = Number(leadTime['averageOverall']).toFixed(1);
      this.loaderService.stopLoading();
      this.displayLeadTime = true;

    }, () => {
      this.noOfWeeksDifference = 'N/A';
      this.loaderService.stopLoading();
    });
  }

  // -------------------------------------------------------------------------------------------------------------------

  goToOfferWorkBench() {

    const userId = this.configurationService.startupData.userId;
    let urlToOpen = this.environmentService.tncOwbUrl;
    // urlToOpen += 'selectedAto=' + this.selectedAto + '&planId=' + this.planId + '&userId=' + userId + '&coolOfferId=' + this.offerId;;

    window.open(urlToOpen, '_blank');
  }

  checkObject(element) {
    if (this.selectedObjectAto && this.selectedObjectAto.itemType === element.itemType && element.itemType === 'License' && element.itemCategory !== this.selectedObjectAto.itemCategory) {
      return true;
    } else {
      return false;
    }
  }

  checkLicenseExist() {
    let userRoleCheck = false;
    let licenseExist = true;

     // Check If Valid User Is Logged In
     userRoleCheck = (this.functionalRole.includes('Business Unit Product Manager (BUPM)') || 
                      this.functionalRole.includes('NPPM')|| 
                      this.functionalRole.includes('PLPM') || 
                      this.functionalRole.includes('CXPM') || 
                      this.functionalRole.includes('OLE')|| 
                      this.functionalRole.includes('PDT')|| 
                      this.functionalRole.includes('SOE')) ? true : false;

    if ((this.selectedObjectAto && this.selectedObjectAto.itemType === 'License') || this.selectedAto === 'Overall Offer') {
      licenseExist = true;
    } else {
      licenseExist = false;
    }
    if (this.selectedObjectAto && this.selectedObjectAto.minorPids && this.selectedObjectAto.minorPids.length > 0) {
      for (let i = 0; i < this.selectedObjectAto.minorPids.length; i++) {
        if (this.selectedObjectAto.minorPids[i].itemType === 'License') {
          licenseExist = true;
        }
      }
    }
    return !licenseExist || !userRoleCheck;

  }

}
