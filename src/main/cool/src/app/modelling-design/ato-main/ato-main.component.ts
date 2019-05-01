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
  offerId: string;
  offerName: string;
  offerOwner: string;

  primaryBE: string;
  derivedMM: string;

  stakeholders: any;
  stakeHolderData: any;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
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

    this.offerId = 'COOL_6845';
    this.selectedAto = 'Overall Offer';
    this.atoNames.push(this.selectedAto);

    this.modellingDesignSubscription = this.modellingDesignService.retrieveAtoList(this.offerId)
      .subscribe((modellingDesignResponse: ModellingDesign) => {

        this.modellingDesign = modellingDesignResponse;
        this.atoList = this.modellingDesign['data'];

        this.atoList.map(dropDownValue => {
          this.atoNames.push(dropDownValue.itemName);
        });

        this.atoTask = {} as Ato;
        this.loaderService.stopLoading();

      });

    // Retrieve Offer Details
    this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(offerDetails => {
      this.offerName = offerDetails['offerName'];
      this.stakeHolderData = offerDetails['stakeholders'];
      this.processStakeHolderInfo();
    });


  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    this.modellingDesignSubscription.unsubscribe();
  }

  // -------------------------------------------------------------------------------------------------------------------

  goToDesignCanvas() {

    const urlToOpen = this.environmentService.owbUrl;
    const functionalRole: Array<String> = this.configurationService.startupData.functionalRole;

    if (functionalRole.includes('BUPM')) {
      window.open(urlToOpen, '_blank');
    }

  }

  goToPirateShip() {
    this.router.navigate(['/offerSetup', this.offerId, this.caseId, this.selectedAto, ]);
  }

  // -------------------------------------------------------------------------------------------------------------------


  showSelectedAtoView(dropDownValue: string) {

    if (dropDownValue === 'Overall Offer') {
      this.selectedAto = dropDownValue;
    } else {
      this.selectedAto = dropDownValue;
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

}
