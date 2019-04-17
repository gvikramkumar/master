import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModellingDesignService } from '../../services/modelling-design.service';
import { StakeholderfullService } from '../../services/stakeholderfull.service';
import { ModellingDesign } from '../model/modelling-design';
import { Ato } from '../model/ato';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modelling-design-ato-list',
  templateUrl: './modelling-design-ato-list.component.html',
  styleUrls: ['./modelling-design-ato-list.component.scss']
})
export class ModellingDesignAtoListComponent implements OnInit {

  atoTask: Ato;
  atoList: Array<Ato>;
  modellingDesign: ModellingDesign;


  selectedAto: any;
  overAllAtoView: boolean;
  atoNames: string[] = [];

  caseId: string;
  offerId: string;
  offerName: string;
  offerOwner: string;

  primaryBE: string;
  derivedMM: string;

  stakeholders: any;
  stakeHolderData: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private modellingDesignService: ModellingDesignService,
    private stakeholderfullService: StakeholderfullService) {

    this.overAllAtoView = true;

    this.activatedRoute.params.subscribe(params => {
      this.offerId = params['id'];
      this.caseId = params['id2'];
    });

  }

  ngOnInit() {

    this.offerId = 'COOL_123';
    this.selectedAto = 'Overall Offer';
    this.atoNames.push(this.selectedAto);

    this.modellingDesignService.retrieveAtoList(this.offerId).subscribe(modellingDesignRes => {

      this.modellingDesign = modellingDesignRes;
      this.atoList = this.modellingDesign['tasks'];

      this.atoList.map(dropDownValue => {
        this.atoNames.push(dropDownValue.itemName);
      });

    });

    // Retrieve Offer Details
    // this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(offerDetails => {
    //   this.offerName = offerDetails['offerName'];
    //   this.stakeHolderData = offerDetails['stakeholders'];
    //   this.processStakeHolderInfo();
    // });


  }

  // -------------------------------------------------------------------------------------------------------------------

  goToDesignCanvas() {

    const urlToOpen = 'www.google.com';

    let url: string = '';
    if (!/^http[s]?:\/\//.test(urlToOpen)) {
      url += 'http://';
    }

    url += urlToOpen;
    window.open(url, '_blank');

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
