import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModellingDesignService } from '../../services/modelling-design.service';
import { StakeholderfullService } from '../../services/stakeholderfull.service';
import { ModellingDesign } from '../model/modelling-design';
import { Ato } from '../model/ato';
import { Subscription } from 'rxjs';
import { EnvironmentService } from '../../../environments/environment.service';
import { ConfigurationService } from '@app/core/services/configuration.service';
import { LoaderService } from '@app/core/services/loader.service';

import * as _ from 'lodash';
import { RightPanelService } from '../../services/right-panel.service';

@Component({
  selector: 'app-ato-main',
  templateUrl: './ato-main.component.html',
  styleUrls: ['./ato-main.component.scss']
})
export class AtoMainComponent implements OnInit, OnDestroy {

  atoTask: Ato;
  atoList: Array<Ato>;
  modellingDesign: ModellingDesign;

  paramsSubscription: Subscription;
  modellingDesignSubscription: Subscription;

  selectedAto: any;
  atoNames: string[] = [];

  caseId: string;
  planId: string;
  offerId: string;
  offerName: string;
  offerOwner: string;

  primaryBE: string;
  derivedMM: string;
  displayLeadTime = false;
  noOfWeeksDifference: string;

  stakeholders: any;
  stakeHolderData: any;

  showDesignCanvasButton: boolean;
  disableDesignCanvasButton: boolean;

  constructor(
    private router: Router,
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

  }

  ngOnInit() {

    this.atoTask = {} as Ato;
    this.atoNames.push(this.selectedAto);
    this.showDesignCanvasButton = this.selectedAto === 'Overall Offer' ? false : true;

    this.modellingDesignSubscription = this.modellingDesignService.retrieveAtoList(this.offerId)
      .subscribe((modellingDesignResponse: ModellingDesign) => {

        this.modellingDesign = modellingDesignResponse;
        this.atoList = this.modellingDesign['data'] ? this.modellingDesign['data'] : [];

        this.atoList.map(dropDownValue => {
          this.atoNames.push(dropDownValue.itemName);
        });

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


    const functionalRole: Array<String> = this.configurationService.startupData.functionalRole;
    this.disableDesignCanvasButton = ((functionalRole.includes('BUPM') || functionalRole.includes('PDT'))
      && (this.atoTask['itemStatus'] === 'Completed')) ? false : true;

  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    this.modellingDesignSubscription.unsubscribe();
  }

  // -------------------------------------------------------------------------------------------------------------------

  goToDesignCanvas() {

    const userId = this.configurationService.startupData.userId;
    let urlToOpen = this.environmentService.owbUrl + '/manage/offer/owbOfferDefinition?';
    urlToOpen += 'selectedAto=' + this.selectedAto + '&planId=' + this.planId + '&userId=' + userId;

    window.open(urlToOpen, '_blank');

  }

  goToPirateShip() {
    this.router.navigate(['/offerSetup', this.offerId, this.caseId, this.selectedAto]);
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
