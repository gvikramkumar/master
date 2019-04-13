import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModellingDesignService } from '../../services/modelling-design.service';
import { StakeholderfullService } from '../../services/stakeholderfull.service';

@Component({
  selector: 'app-modelling-design-ato-list',
  templateUrl: './modelling-design-ato-list.component.html',
  styleUrls: ['./modelling-design-ato-list.component.scss']
})
export class ModellingDesignAtoListComponent implements OnInit {

  atoTask: {};
  atoList: {};
  atoStatusList: any;
  atoDropDownList: any;

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


    this.activatedRoute.params.subscribe(params => {
      this.offerId = params['id'];
      this.caseId = params['id2'];
    });

  }

  ngOnInit() {

    // this.atoList = {
    //   'requestId': '238434092834234', 'action': 'STATUS', 'module': 'MODELLING&DESIGN',
    //   'coolOfferId': 'COOL_123', 'planId': '23423234',
    //   'planStatus': 'INPROGRESS|COMPLETE',
    //   'tasks': [{
    //     'itemName': 'ATO-123', 'itemStatus': 'COMPLETE',
    //     'modelTasks': [{ 'taskName': 'OFFER DESIGN', 'taskStatus': 'COMPLETE' },
    //     { 'taskName': 'BU CONFIG', 'taskStatus': 'COMPLETE' },
    //     { 'taskName': 'TRANSACTION VERIFICATION & PUBLISH TO PROD', 'taskStatus': 'INPROGRESS' },
    //     { 'taskName': 'NPI TEST ORDERABILITY', 'taskStatus': 'NOT STARTED' }],
    //     'provisionTasks': [{ 'taskName': 'SETUP', 'taskStatus': 'NOT REQUIRED' },
    //     { 'taskName': 'MODEL (iService Configuration)', 'taskStatus': 'NOT REQUIRED' },
    //     { 'taskName': 'PROVISIONING VALIDATION', 'taskStatus': 'NOT REQUIRED' },
    //     { 'taskName': 'ISERVICE VALIDATION', 'taskStatus': 'NOT REQUIRED' }]
    //   },
    //   {
    //     'itemName': 'ATO-1231', 'itemStatus': 'COMPLETE',
    //     'modelTasks': [{ 'taskName': 'OFFER DESIGN', 'taskStatus': 'COMPLETE' },
    //     { 'taskName': 'BU CONFIG', 'taskStatus': 'COMPLETE' },
    //     { 'taskName': 'TRANSACTION VERIFICATION & PUBLISH TO PROD', 'taskStatus': 'INPROGRESS' },
    //     { 'taskName': 'NPI TEST ORDERABILITY', 'taskStatus': 'NOT STARTED' }],
    //     'provisionTasks': [{ 'taskName': 'SETUP', 'taskStatus': 'NOT REQUIRED' }, {
    //       'taskName': 'MODEL (iService Configuration)', 'taskStatus': 'NOT REQUIRED'
    //     },
    //     { 'taskName': 'PROVISIONING VALIDATION', 'taskStatus': 'NOT REQUIRED' },
    //     { 'taskName': 'ISERVICE VALIDATION', 'taskStatus': 'NOT REQUIRED' }]
    //   }]
    // };

    this.offerId = 'COOL_123';
    this.modellingDesignService.retrieveAtoList(this.offerId).subscribe(atoListResponse => {

      this.atoList = atoListResponse as Array<any>;
      this.atoTask = this.atoList['tasks'].find(ato => ato.itemName = 'ATO-123');
      this.atoDropDownList = this.atoList['tasks'].map(dropDownValue => {
        return dropDownValue.itemName;
      });

      this.atoStatusList = this.atoList['tasks'].map(ato => {
        return {
          'itemName': ato.itemName,
          'status': ato.status
        };
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

    // window.open('www.google.com', '_blank');
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
