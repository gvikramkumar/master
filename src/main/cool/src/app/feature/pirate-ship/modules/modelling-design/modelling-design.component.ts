import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ato } from './model/ato';
import { ModellingDesign } from './model/modelling-design';

import { LoaderService } from '@app/core/services/loader.service';
import { EnvironmentService } from '@env/environment.service';
import { ConfigurationService } from '@app/core/services/configuration.service';

import { RightPanelService } from '@app/services/right-panel.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { ModellingDesignService } from '@app/services/modelling-design.service';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modelling-design',
  templateUrl: './modelling-design.component.html',
  styleUrls: ['./modelling-design.component.scss']
})
export class ModellingDesignComponent implements OnInit, OnDestroy {

  atoTask: Ato;
  atoList: Array<Ato>;
  modellingDesign: ModellingDesign;

  selectedAto: any;
  atoNames: string[] = [];

  paramsSubscription: Subscription;
  modellingDesignSubscription: Subscription;

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

  showDesignCanvasButton: boolean;
  disableDesignCanvasButton: boolean;

  constructor(
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private rightPanelService: RightPanelService,
    private environmentService: EnvironmentService,
    private configurationService: ConfigurationService,
    private modellingDesignService: ModellingDesignService,
    private stakeholderfullService: StakeholderfullService) {

    this.paramsSubscription = this.activatedRoute.params.subscribe(params => {
      this.caseId = params['caseId'];
      this.offerId = params['offerId'];
      this.selectedAto = params['selectedAto'];
    });

    this.loaderService.startLoading();

    // Initialize TaskBar Params
    this.isPirateShipSubModule = true;
    this.pirateShipModuleName = 'Modeling & Design';

  }

  ngOnInit() {

    // Retrieve ATO Details

    this.atoTask = {} as Ato;
    this.atoNames.push('Overall Offer');

    this.functionalRole = this.configurationService.startupData.functionalRole;
    this.showDesignCanvasButton = this.selectedAto === 'Overall Offer' ? false : true;

    this.modellingDesignSubscription = this.modellingDesignService.retrieveModelingActivities(this.offerId)
      .subscribe((modellingDesignResponse: ModellingDesign) => {

        this.modellingDesign = modellingDesignResponse;
        this.atoList = this.modellingDesign['data'] ? this.modellingDesign['data'] : [];

        this.atoList.
          map(dropDownValue => {
            this.atoNames.push(dropDownValue.itemName);
          });

        this.atoTask = _.find(this.atoList, ['itemName', this.selectedAto]);
        const currentAtoStatus = _.isEmpty(this.atoTask) ? '' : this.atoTask.itemStatus;
        this.disableDesignCanvasButton = this.showDesignCanvasButton ? this.designCanvasButtonStatus(currentAtoStatus) : false;

      });

    // Retrieve Offer Details
    this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(offerDetails => {

      this.derivedMM = offerDetails['derivedMM'];
      this.offerName = offerDetails['offerName'];
      this.primaryBE = offerDetails['primaryBEList'][0];
      this.stakeHolderData = offerDetails['stakeholders'];
      this.planId = _.isEmpty(offerDetails['planId']) ? 0 : offerDetails['planId'];

      this.processStakeHolderInfo();
      this.getLeadTimeCalculation();

    });


  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    this.modellingDesignSubscription.unsubscribe();
  }

  // -------------------------------------------------------------------------------------------------------------------

  goToDesignCanvas() {

    this.modellingDesignSubscription = this.modellingDesignService.updateModelingDesignStatus(this.offerId, this.selectedAto)
      .subscribe(() => {

        const userId = this.configurationService.startupData.userId;
        let urlToOpen = this.environmentService.owbUrl + '/owb/manage/offer/owbOfferDefinition?';
        urlToOpen += 'selectedAto=' + this.selectedAto + '&planId=' + this.planId + '&userId=' + userId + '&coolOfferId=' + this.offerId;

        window.open(urlToOpen, '_blank');

      });

  }

  // -------------------------------------------------------------------------------------------------------------------


  showSelectedAtoView(dropDownValue: string) {

    if (dropDownValue === 'Overall Offer') {

      this.selectedAto = dropDownValue;
      this.showDesignCanvasButton = false;

    } else {

      this.selectedAto = dropDownValue;
      this.showDesignCanvasButton = true;
      this.atoTask = this.atoList.find(ato => ato.itemName === dropDownValue);

      const currentAtoStatus = _.isEmpty(this.atoTask) ? '' : this.atoTask.itemStatus;
      this.disableDesignCanvasButton = this.designCanvasButtonStatus(currentAtoStatus);

    }
  }

  designCanvasButtonStatus(currentStatus: string): boolean {

    let statusCheck = false;
    let userRoleCheck = false;

    // Check If ATO has Valid Status
    const statusList = ['Completed', 'In Progress', 'Available', 'Not Required'];
    if (statusList.some(status => currentStatus.includes(status))) {
      statusCheck = true;
    } else {
      statusCheck = false;
    }

    // Check If Valid User Is Logged In
    userRoleCheck = (this.functionalRole.includes('BUPM') || this.functionalRole.includes('PDT'))
      ? true : false;

    return (statusCheck && userRoleCheck);
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


