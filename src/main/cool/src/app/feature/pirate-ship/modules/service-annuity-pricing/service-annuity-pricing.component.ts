import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';


import { LoaderService } from '@app/core/services/loader.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { ServiceAnnuityPricingService } from '@app/services/service_annuity_pricing.service';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { ServiceAnnuityDesign } from './model/service-annuity-design';
import {PirateShipSharedService} from '@app/services/pirate-ship-shared.service';

@Component({
  selector: 'app-service-annuity-pricing',
  templateUrl: './service-annuity-pricing.component.html',
  styleUrls: ['./service-annuity-pricing.component.scss']
})
export class ServiceAnnuityPricingComponent implements OnInit, OnDestroy {

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

  pirateShipModuleName: string;
  isPirateShipSubModule: boolean;

  selectedAto: any;
  atoNames: string[] = [];
  atoList: any;

  paramsSubscription: Subscription;

  constructor(
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private rightPanelService: RightPanelService,
    private stakeholderfullService: StakeholderfullService,
    private serviceAnnuityPricing: ServiceAnnuityPricingService,
    private _pirateshipService: PirateShipSharedService
  ) {

    this.paramsSubscription = this.activatedRoute.params.subscribe(params => {
      this.caseId = params['caseId'];
      this.offerId = params['offerId'];
      this.selectedAto = params['selectedAto'];
    });

    this.loaderService.startLoading();

    // Initialize TaskBar Params
    this.isPirateShipSubModule = true;
    this.pirateShipModuleName = ' Service Annuity % Pricing';

  }

  // -------------------------------------------------------------------------------------------------------------------


  ngOnInit() {

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

    this.serviceAnnuityPricing.getOfferDropdownValues(this.offerId).subscribe(atoList => {
      this.atoNames = atoList;
    }, error => {
      console.log('error', error);
    });

    this.serviceAnnuityPricing.getServiceAnnuityPricing(this.offerId).subscribe(atoList => {
      this.atoList = atoList['majorATOs'];
        }, error => {
      console.log('error', error);
    });
   
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  // -------------------------------------------------------------------------------------------------------------------

  showSelectedAtoView(dropDownValue: string) {

    if (dropDownValue === 'Overall Offer') {

      this.selectedAto = dropDownValue;

    } else {

      this.selectedAto = dropDownValue;
      this._pirateshipService.update_pricing.next(dropDownValue);

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


}
