import { Component, ViewChild, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { SearchCollaboratorService } from '@app/services/search-collaborator.service';
import { ConfigurationService } from '@app/core/services';

import * as _ from 'lodash';
import { User } from '@app/models/user';
import { MonetizationModelService } from '@app/services/monetization-model.service';
import { AccessManagementService } from '@app/services/access-management.service';

@Component({
  selector: 'app-stakeholder-add',
  templateUrl: './stakeholder-add.component.html',
  styleUrls: ['./stakeholder-add.component.scss']
})
export class StakeholderAddComponent implements OnInit {


  caseId: string;
  primaryBE: string;
  derivedMM: string;
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
  newUserAddedInfo:string[];
  strnewUserAddedInfo:string;
  showUserAddedInfoNotification: boolean = false;
  stakeholderForm: FormGroup;
  @Output() updatedStakeHolderMapInfo = new EventEmitter<any>();

  // ---------------------------------------------------------------------------------------------

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessMgmtService: AccessManagementService,
    private configurationService: ConfigurationService,
    private stakeholderfullService: StakeholderfullService,
    private monetizationModelService: MonetizationModelService,
    private searchCollaboratorService: SearchCollaboratorService) {

    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
    });

  }

  // ---------------------------------------------------------------------------------------------

  ngOnInit() {

    this.stakeholderForm = new FormGroup({
      userName: new FormControl(null, Validators.required)
    });

    this.stakeholderfullService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {

      this.offerName = data['offerName'];
      this.derivedMM = data['derivedMM'];
      this.offerOwner = data['offerOwner'];
      this.primaryBE = data['primaryBEList'][0];
      this.stakeHolderData = data['stakeholders'] ? data['stakeholders'] : [];
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
            'offerRole': user['userMappings'][0]['functionalRole'] === 'Business Unit Product Manager (BUPM)' && user['_id'] === this.offerOwner
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

  private formatDefaultUserAsStakeholder(userInfo: any): any {
    return {
      userName: userInfo.userName,
      emailId: userInfo._id + '@cisco.com',
      _id: userInfo._id,
      userMappings: [{
        appRoleList: userInfo['userMappings'][0]['appRoleList'] == null ?
          [] : userInfo['userMappings'][0]['appRoleList'],
        businessEntity: userInfo['userMappings'][0]['businessEntity'],
        functionalRole: userInfo['userMappings'][0]['functionalRole'],
        offerRole: userInfo['userMappings'][0]['functionalRole'],
      }
      ],
      stakeholderDefaults: true
    };
  }

  private formatStakeHolderOwnerToUpdateOffer(user: User): any {
    return {
      '_id': user['userId'],
      'businessEntity': user['userMapping'][0]['businessEntity'],
      'functionalRole': user['userMapping'][0]['functionalRole'],
      'offerRole': user['userMapping'][0]['functionalRole'] === 'Business Unit Product Manager (BUPM)' && user['userId'] === this.offerOwner
        ? 'Owner' : user['userMapping'][0]['functionalRole'],
      'stakeholderDefaults': true,
      'name': user['userName']
    };
  }


  private formatStakeHolderPojoToUpdateOffer_1(user: any) {

    const stakeHolderUpdateOfferFormat = [];

    for (const functionalRole of Object.keys(this.stakeHolderMapInfo)) {
      this.stakeHolderMapInfo[functionalRole]
        .map((currentStakeHolder: User) => {
          stakeHolderUpdateOfferFormat.push(this.formatStakeHolderPojoToUpdateOffer(currentStakeHolder));
        });
    }
    return stakeHolderUpdateOfferFormat;
  }

  private formatStakeHolderPojoToUpdateOffer(user: User): any {
    return {
      '_id': user['_id'],
      'businessEntity': user['userMappings'][0]['businessEntity'],
      'functionalRole': user['userMappings'][0]['functionalRole'],
      'offerRole': user['userMappings'][0]['functionalRole'] === 'Business Unit Product Manager (BUPM)' && user['_id'] === this.offerOwner
        ? 'Owner' : user['userMappings'][0]['functionalRole'],
      'stakeholderDefaults': user['stakeholderDefaults'] ? user['stakeholderDefaults'] : false,
      'name': user['userName']
    };
  }

  private compareAndAddNewStakeHolders(newStakeHolderList: User[], existingStakeHolderList: {}, defaultStakeHolder: boolean): {} {

    newStakeHolderList.reduce((stakeHolderAccumulator, currentStakeholder) => {

      const stakeholder = {
        ...currentStakeholder,
        stakeholderDefaults: defaultStakeHolder
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


    this.stakeholderfullService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {

      this.accessMgmtService.retrieveUserInfo(this.offerOwner).subscribe(ownerInfo => {

        this.monetizationModelService.retrieveDefaultStakeHolders(data['derivedMM'], data['primaryBEList'][0])
          .subscribe(defaultStakeholdersObj => {


            const owner = this.formatStakeHolderOwnerToUpdateOffer(ownerInfo);

            // Retrieve Default Stake Holders Details Related To Current Offer
            const defaultStakeholders = defaultStakeholdersObj as Array<User>;

            const defaultStakeHolderMap = defaultStakeholders.map(user =>
              this.formatDefaultUserAsStakeholder(user));

            const newlyAddedStakeHolderMap = this.selectedStakeHolders.map(user =>
              this.formatUserAsStakeholder(user, false));
              this.showUserAddedInfoNotification = true;
              setTimeout(()=>{
                this.showUserAddedInfoNotification = false;
              },5000)
              this.newUserAddedInfo = newlyAddedStakeHolderMap.map(user=>user.userName);
              this.strnewUserAddedInfo = this.newUserAddedInfo.toString()
            this.stakeHolderMapInfo = this.compareAndAddNewStakeHolders(defaultStakeHolderMap, this.stakeHolderMapInfo, true);
            this.stakeHolderMapInfo = this.compareAndAddNewStakeHolders(newlyAddedStakeHolderMap, this.stakeHolderMapInfo, false);

            this.updatedStakeHolderMapInfo.emit(this.stakeHolderMapInfo);
            this.stakeHolderListInfo = this.formatStakeHolderPojoToUpdateOffer_1(this.stakeHolderMapInfo);

            this.stakeHolderListInfo.push(owner);
            this.stakeHolderListInfo = _.uniqBy(this.stakeHolderListInfo.concat(this.selectedStakeHolders), '_id');

            const stakeholdersPayLoad = {
              offerId: this.currentOfferId,
              stakeholders: this.stakeHolderListInfo
            };

            this.stakeholderfullService.updateOfferDetails(stakeholdersPayLoad).subscribe();

            this.selectedStakeHolders = null;
            this.stakeholderForm.reset();

          });

      });

    });

  }


  // ---------------------------------------------------------------------------------------------

}
