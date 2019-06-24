import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '@app/core/services/user.service';
import { OfferSetupService } from '@app/services/offer-setup.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';

import { PirateShip } from './model/pirate-ship';
import { appRoutesNames } from '@app/app.routes.names';
import { pirateShipRoutesNames } from './pirate-ship.routes.names';

import { ActionsService } from '@app/services/actions.service';
import { ConfigurationService } from '../../core/services/configuration.service';

import { EnvironmentService } from '@env/environment.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import * as fromPirateShip from './state';
import { Store, select } from '@ngrx/store';
import * as pirateShipActions from './state/pirate-ship.action';

@Component({
  selector: 'app-offer-setup',
  templateUrl: './offer-setup.component.html',
  styleUrls: ['./offer-setup.component.scss']
})
export class OfferSetupComponent implements OnInit, OnDestroy {

  offerId;
  caseId;
  setFlag;
  message;
  offerName;
  offerData;
  primaryBE: string;

  derivedMM;
  moduleStatus;
  functionalRole;
  readOnly = false;

  stakeholders: any;
  stakeHolderData = [];
  stakeHolderInfo: any;

  groupData = {};
  showGroupData = false;

  atoNames: any[] = [];
  offerBuilderdata = {};
  displayLeadTime = false;
  noOfWeeksDifference: string;
  backbuttonStatusValid = true;
  proceedButtonStatusValid = true;
  proceedToreadinessreview = true;

  selectedAto: string;
  designReviewComplete: Boolean = false;

  pirateShip: PirateShip;
  errorMessage$: Observable<string>;
  pirateShipSubscription: Subscription;
  selectedPirateShipInfo$: Observable<PirateShip>;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private _env: EnvironmentService,
    private userService: UserService,

    private activatedRoute: ActivatedRoute,
    private actionsService: ActionsService,
    private store: Store<fromPirateShip.State>,
    private offerSetupService: OfferSetupService,
    private rightPanelService: RightPanelService,
    private configurationService: ConfigurationService,
    private stakeholderfullService: StakeholderfullService,

  ) {

    this.activatedRoute.params.subscribe(params => {
      this.offerId = params['offerId'];
      this.caseId = params['caseId'];
      if (params['selectedAto']) {
        this.selectedAto = params['selectedAto'];
      }
    });

  }

  // ----------------------------------------------------------------------------------------------------------------

  ngOnInit() {

    this.showGroupData = false;
    this.selectedAto = 'Overall Offer';
    this.functionalRole = this.userService.getFunctionalRole();

    this.store.dispatch(new pirateShipActions.LoadPirateShip(
      {
        offerId: this.offerId,
        offerLevel: this.selectedAto,
        functionalRole: this.functionalRole
      }
    ));

    this.offerSetupService.lockAPIForOWB(this.offerId).subscribe(() => {
    });

    // Check design review status for enabling Item Creation Module
    this.actionsService.getMilestones(this.caseId).subscribe(data => {
      data['plan'].forEach(element => {
        if (element['subMilestone'] === 'Design Review' && element['status'] === 'Completed') {
          this.designReviewComplete = true;
        }
      });
    });

    // Get Module Name and Status
    this.getAllModuleData();

    // Get Offer Details
    this.getOfferDetails();

  }

  ngOnDestroy(): void {
    this.pirateShipSubscription.unsubscribe();
  }

  // ----------------------------------------------------------------------------------------------------------------

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

  // ----------------------------------------------------------------------------------------------------------------

  // Get All the ModuleName and place in order
  getAllModuleData() {

    // this.errorMessage$ = this.store.pipe(select(fromPirateShip.getError));
    this.pirateShipSubscription = this.store.pipe(select(fromPirateShip.getSelectedPirateShipInfo))
      // this.offerSetupService.getPirateShipInfo(this.offerId, this.selectedAto, this.functionalRole)
      .subscribe((pirateShipResponse: PirateShip) => {

        this.groupData = {};
        this.showGroupData = false;
        this.pirateShip = pirateShipResponse;

        if (!_.isEmpty(this.pirateShip)) {

          this.pirateShip['listSetupDetails'].forEach(group => {

            const groupName = group['groupName'];
            if (this.groupData[groupName] == null) {
              this.groupData[groupName] = { 'left': [], 'right': [] };
            }
            if (group['colNum'] === 1) {
              this.groupData[groupName]['left'].push(group);
            } else {
              this.groupData[groupName]['right'].push(group);
            }

          });

          this.sortGroupData();
          this.showGroupData = true;

          this.atoNames = this.pirateShip['listATOs'];
          this.atoNames.push('Overall Offer');
          this.atoNames = _.uniqBy(this.atoNames);

        }

      }, (err => console.log(err))
      );
  }

  // ----------------------------------------------------------------------------------------------------------------

  // sort the module location
  sortGroupData() {
    this.groupData['Group3']['left'].sort(
      (a, b) => (a.rowNum > b.rowNum) ? 1 : ((b.rowNum > a.rowNum) ? -1 : 0)
    );
    this.groupData['Group3']['right'].sort(
      (a, b) => (a.rowNum > b.rowNum) ? 1 : ((b.rowNum > a.rowNum) ? -1 : 0)
    );
  }

  // ----------------------------------------------------------------------------------------------------------------

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

  // ----------------------------------------------------------------------------------------------------------------

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


  // ----------------------------------------------------------------------------------------------------------------

  getElementDetails(element) {

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

  // ----------------------------------------------------------------------------------------------------------------

  selectedValue(dropDownValue: string) {

    this.selectedAto = dropDownValue;

    this.store.dispatch(new pirateShipActions.LoadPirateShip(
      {
        offerId: this.offerId,
        offerLevel: this.selectedAto,
        functionalRole: this.functionalRole
      }
    ));

    this.getAllModuleData();

  }

  refreshPirateship() {
    this.httpClient.get(this._env.REST_API_OFFER_SETUP_REFRESH + '/' + this.offerId, {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')
        .append('Authorization', `Bearer ${this.configurationService.startupData.token}`)
        .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        .append('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept')
    }).subscribe(
      (res) => {
      }
    );
  }

}
