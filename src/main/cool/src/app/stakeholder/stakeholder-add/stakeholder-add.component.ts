import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { SearchCollaboratorService } from '@app/services/search-collaborator.service';
import { ConfigurationService } from '@shared/services';

import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { HttpClient } from '@angular/common/http';

import * as _ from 'lodash';

@Component({
  selector: 'app-stakeholder-add',
  templateUrl: './stakeholder-add.component.html',
  styleUrls: ['./stakeholder-add.component.scss']
})
export class StakeholderAddComponent implements OnInit {


  caseId: string;
  offerName: string;
  currentOfferId: string;

  stakeHolderData: any[];
  stakeHolderMapInfo = {};
  stakeHolderListInfo: any[] = [];

  newlyAddedStakeHolderList: any[] = [];
  searchStakeHolderResultList: any[] = [];

  selectedStakeHolders;
  searchStakeHolderInput;
  searchStakeHolderResults: String[];

  stakeholderForm: FormGroup;

  // ---------------------------------------------------------------------------------------------

  constructor(private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private configurationService: ConfigurationService,
    private stakeholderfullService: StakeholderfullService,
    private searchCollaboratorService: SearchCollaboratorService) {

    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });

  }

  // ---------------------------------------------------------------------------------------------

  ngOnInit() {

    this.stakeholderForm = new FormGroup({
      userName: new FormControl(null, Validators.required)
    });

    this.stakeholderfullService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {
      this.offerName = data['offerName'];
      this.stakeHolderData = data['stakeholders'];
      this.processStakeHolderData(data['stakeholders']);
    });

  }

  // ---------------------------------------------------------------------------------------------

  processStakeHolderData(stakeHolderData: any) {

    stakeHolderData.forEach(stakeHolder => {

      if (this.stakeHolderMapInfo[stakeHolder['offerRole']] == null) {
        this.stakeHolderMapInfo[stakeHolder['offerRole']] = [];
      }

      // Stake Holder Info To Display Acc 2 Functional Role On UI
      this.stakeHolderMapInfo[stakeHolder['offerRole']].push(
        {
          name: stakeHolder['name'],
          email: stakeHolder['_id'] + '@cisco.com',
          _id: stakeHolder['_id'],
          businessEntity: stakeHolder['businessEntity'],
          functionalRole: stakeHolder['functionalRole'],
          offerRole: stakeHolder['offerRole'],
          stakeholderDefaults: stakeHolder['stakeholderDefaults']
        });

      // Stake Holder Info To Update Offer Details
      this.stakeHolderListInfo.push(
        {
          name: stakeHolder['name'],
          email: stakeHolder['_id'] + '@cisco.com',
          _id: stakeHolder['_id'],
          businessEntity: stakeHolder['businessEntity'],
          functionalRole: stakeHolder['functionalRole'],
          offerRole: stakeHolder['offerRole'],
          stakeholderDefaults: stakeHolder['stakeholderDefaults']
        });
    });
  }

  // ---------------------------------------------------------------------------------------------

  search(event: string) {

    this.searchCollaboratorService.searchCollaborator({ 'userName': event })
      .subscribe(collaboratorsResponseList => {

        const adminRole = ['Owner', 'Co-Owner'];
        const currentUserRole = this.configurationService.startupData.appRoleList;
        const currentUserFunctionalRole = this.configurationService.startupData.functionalRole[0];

        if (adminRole.some(user => currentUserRole.includes(user))) {
          this.searchStakeHolderResults = collaboratorsResponseList;
        } else {
          this.searchStakeHolderResults = collaboratorsResponseList
            .filter(collaborator => collaborator.userMappings[0]['functionalRole'] === currentUserFunctionalRole);
        }

        this.searchStakeHolderResultList = this.searchStakeHolderResults.map(user => {
          return {
            '_id': user['_id'],
            'name': user['userName'],
            'emailId': user['emailId'],
            'stakeholderDefaults': false,
            'businessEntity': user['userMappings'][0]['businessEntity'],
            'functionalRole': user['userMappings'][0]['functionalRole'],
            'offerRole': _.isEmpty(user['userMappings'][0]['appRoleList']) ? user['userMappings'][0]['functionalRole']
              : user['userMappings'][0]['appRoleList'][0],
          };
        });

      });

  }


  // ---------------------------------------------------------------------------------------------

  // onAdd() {

  //   this.stakeholderfullService.updateOfferDetails(stakeholdersPayLoad).subscribe();

  //   this.stakeholderForm.reset();

  // }


  // ---------------------------------------------------------------------------------------------


  addSelectedStakeHolders() {
    console.log(this.selectedStakeHolders);
    this.newlyAddedStakeHolderList = this.newlyAddedStakeHolderList.concat(this.selectedStakeHolders);
    this.newlyAddedStakeHolderList = _.uniqBy(this.newlyAddedStakeHolderList);
    this.selectedStakeHolders = null;
  }

}

