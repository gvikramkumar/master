import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { SearchCollaboratorService } from '@app/services/search-collaborator.service';
import { ConfigurationService } from '@shared/services';

import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { HttpClient } from '@angular/common/http';

import * as _ from 'lodash';
import { User } from '@app/models/user';

@Component({
  selector: 'app-stakeholder-add',
  templateUrl: './stakeholder-add.component.html',
  styleUrls: ['./stakeholder-add.component.scss']
})
export class StakeholderAddComponent implements OnInit {


  caseId: string;
  offerName: string;
  offerOwner: string;
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
      this.offerOwner = data['offerOwner'],
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
          userName: stakeHolder['name'],
          emailId: stakeHolder['_id'] + '@cisco.com',
          _id: stakeHolder['_id'],
          userMappings: [{
            appRoleList: stakeHolder['appRoleList'],
            businessEntity: stakeHolder['businessEntity'],
            functionalRole: stakeHolder['functionalRole'],
            offerRole: stakeHolder['offerRole'],
          }
          ],
          stakeholderDefaults: stakeHolder['stakeholderDefaults']
        });

      // Stake Holder Info To Update Offer Details
      this.stakeHolderListInfo.push(
        {
          name: stakeHolder['name'],
          emailId: stakeHolder['_id'] + '@cisco.com',
          _id: stakeHolder['_id'],
          businessEntity: stakeHolder['businessEntity'],
          functionalRole: stakeHolder['functionalRole'],
          offerRole: stakeHolder['offerRole'],
          appRoleList: stakeHolder['appRoleList'],
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
            'offerRole': user['userMappings'][0]['functionalRole'] === 'BUPM' && user['_id'] === this.offerOwner
              ? 'Owner' : user['userMappings'][0]['functionalRole'],
            appRoleList: user['userMappings'][0]['appRoleList'] == null ?
              [] : user['userMappings'][0]['appRoleList'],
          };
        });

      });

  }


  // ---------------------------------------------------------------------------------------------

  onAdd() {

    this.stakeHolderListInfo = _.uniqBy(this.stakeHolderListInfo.concat(this.newlyAddedStakeHolderList));

    const stakeholdersPayLoad = {
      offerId: this.currentOfferId,
      stakeholders: this.stakeHolderListInfo
    };

    this.stakeholderfullService.updateOfferDetails(stakeholdersPayLoad).subscribe();
    this.stakeholderForm.reset();

  }

  private formatUserAsStakeholder(userInfo: any, defaultStakeHolderExists: boolean): any {
    return {
      userName: userInfo.name,
      emailId: userInfo._id + '@cisco.com',
      _id: userInfo._id,
      userMappings: [{
        appRoleList: userInfo.appRoleList,
        businessEntity: userInfo.businessEntity,
        functionalRole: userInfo.functionalRole,
        offerRole: userInfo.offerRole,
      }
      ],
      stakeholderDefaults: defaultStakeHolderExists
    };
  }

  private compareAndAddNewStakeHolders(newStakeHolderList: User[], existingStakeHolderList: {}): {} {

    newStakeHolderList.reduce((stakeHolderAccumulator, currentStakeholder) => {

      const stakeholder = {
        ...currentStakeholder,
        stakeholderDefaults: false
      };
      const stakeholderFunctionRole = currentStakeholder['userMappings'][0]['functionalRole'];

      // Check If Stakeholder Is Already Present In Existing Stakeholder list
      const isCurrentUserInStakeholders = existingStakeHolderList[stakeholderFunctionRole]
        && existingStakeHolderList[stakeholderFunctionRole].some(stk => stk._id === currentStakeholder._id);

      // Add Stakeholder, If Not Present In Existing Stakholder List
      if (!isCurrentUserInStakeholders) {
        stakeHolderAccumulator[stakeholderFunctionRole] = stakeHolderAccumulator[stakeholderFunctionRole]
          && stakeHolderAccumulator[stakeholderFunctionRole].length > 0 ?
          stakeHolderAccumulator[stakeholderFunctionRole].concat(stakeholder) : [stakeholder];
      }

      return stakeHolderAccumulator;
    }, existingStakeHolderList);

    return existingStakeHolderList;

  }

  // ---------------------------------------------------------------------------------------------


  addSelectedStakeHolders() {

    const newlyAddedStakeHolderMap = this.selectedStakeHolders.map(user =>
      this.formatUserAsStakeholder(user, false));

    this.stakeHolderMapInfo = this.compareAndAddNewStakeHolders(newlyAddedStakeHolderMap, this.stakeHolderMapInfo);

    this.stakeHolderListInfo = _.uniqBy(this.stakeHolderListInfo.concat(this.selectedStakeHolders));

    const stakeholdersPayLoad = {
      offerId: this.currentOfferId,
      stakeholders: this.stakeHolderListInfo
    };

    this.stakeholderfullService.updateOfferDetails(stakeholdersPayLoad).subscribe();

    this.selectedStakeHolders = null;
    this.stakeholderForm.reset();
  }

  // ---------------------------------------------------------------------------------------------



}
