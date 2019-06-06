import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ConfigurationService } from '@app/core/services';
import { EnvironmentService } from '@env/environment.service';
import { LoaderService } from '@app/core/services/loader.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { SelfServiceOrderabilityService } from '../../../services/self-service-orderability.service';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';

import { SsoAto } from './models/sso-ato';
import { DashboardService } from '@shared/services';
import { pirateShipRoutesNames } from '@shared/constants/pirateShipStatus';
import { SelfServiceOrderability } from './models/self-service-orderability';




@Component({
  selector: 'app-self-service-orderability',
  templateUrl: './self-service-orderability.component.html',
  styleUrls: ['./self-service-orderability.component.css']
})
export class SelfServiceOrderabilityComponent implements OnInit, OnDestroy {

  sso: SsoAto;
  ssoList: Array<SsoAto>;
  selfServiceOrderability: SelfServiceOrderability;

  selectedAto: any;
  atoNames: string[] = [];

  paramsSubscription: Subscription;
  selfServiceOrderabilitySubscription: Subscription;

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

  showOrderabilityButton: boolean;
  disableOrderabilityButton: boolean;

  constructor(
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private dashBoardService: DashboardService,
    private rightPanelService: RightPanelService,
    private environmentService: EnvironmentService,
    private configurationService: ConfigurationService,
    private stakeholderfullService: StakeholderfullService,
    private selfServiceOrderabilityService: SelfServiceOrderabilityService,
  ) {

    this.paramsSubscription = this.activatedRoute.params.subscribe(params => {
      this.caseId = params['caseId'];
      this.offerId = params['offerId'];
      this.selectedAto = params['selectedAto'];
    });

    this.loaderService.startLoading();

    // Initialize TaskBar Params
    this.isPirateShipSubModule = true;
    this.pirateShipModuleName = 'Self Service Orderability';

  }

  // -------------------------------------------------------------------------------------------------------------------


  ngOnInit() {

    // Retrieve ATO Details

    this.sso = {} as SsoAto;
    this.atoNames.push('Overall Offer');

    this.showOrderabilityButton = true;
    this.functionalRole = this.configurationService.startupData.functionalRole;
    // this.showOrderabilityButton = this.selectedAto === 'Overall Offer' ? true : true;

    this.selfServiceOrderabilitySubscription = this.selfServiceOrderabilityService.retieveSsoDetails(this.offerId)
      .subscribe((selfServiceOrderabilityResponse: SelfServiceOrderability) => {

        this.selfServiceOrderability = selfServiceOrderabilityResponse;

        this.ssoList = this.selfServiceOrderability['data'] ? this.selfServiceOrderability['data'] : [];

        this.ssoList.
          map(dropDownValue => {
            this.atoNames.push(dropDownValue.itemName);
          });

        this.sso = _.find(this.ssoList, ['itemName', this.selectedAto]);
        const currentAtoStatus = _.isEmpty(this.sso) ? '' : this.sso.orderabilityCheckStatus;
        this.disableOrderabilityButton = this.orderabilityButtonStatus(currentAtoStatus);

        this.postPirateShipDashBoardNotification();

      });

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

  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    this.selfServiceOrderabilitySubscription.unsubscribe();
  }

  // -------------------------------------------------------------------------------------------------------------------

  goToOrderabilitySSO() {

    const urlToOpen = this.environmentService.ssoUrl;
    window.open(urlToOpen, '_blank');

  }

  // -------------------------------------------------------------------------------------------------------------------

  showSelectedAtoView(dropDownValue: string) {

    if (dropDownValue === 'Overall Offer') {

      this.selectedAto = dropDownValue;
      this.showOrderabilityButton = false;

    } else {

      this.selectedAto = dropDownValue;
      this.showOrderabilityButton = true;

      this.sso = this.ssoList.find(ato => ato.itemName === dropDownValue);
      const currentAtoStatus = _.isEmpty(this.sso.orderabilityCheckStatus) ? '' : this.sso.orderabilityCheckStatus;
      this.disableOrderabilityButton = this.orderabilityButtonStatus(currentAtoStatus);

    }

  }

  // -------------------------------------------------------------------------------------------------------------------

  orderabilityButtonStatus(currentStatus: string): boolean {

    let statusCheck = false;
    let userRoleCheck = false;

    // Check If ATO has Valid Status
    const statusList = ['Y', 'N', ''];
    if (statusList.some(status => currentStatus.includes(status))) {
      statusCheck = true;
    } else {
      statusCheck = false;
    }

    // Check If Valid User Is Logged In
    userRoleCheck = (this.functionalRole.includes('NPPM') || this.functionalRole.includes('PDT'))
      ? true : false;

    return (statusCheck && userRoleCheck);
  }

  // -------------------------------------------------------------------------------------------------------------------

  private postPirateShipDashBoardNotification() {

    const existingAtoCount = this.ssoList.length;
    const validAtoCount = this.ssoList
      .filter(sso => sso.orderabilityCheckStatus === pirateShipRoutesNames.Y)
      .length;

    if (validAtoCount === existingAtoCount) {
      this.dashBoardService.postPirateShipDashBoardNotification(this.offerId, 'Orderability').subscribe();
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
