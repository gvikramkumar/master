import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MonetizationModelService } from '@app/services/monetization-model.service';
import { OfferPhaseService } from '@app/services/offer-phase.service';
import { MenuBarService } from '@app/services/menu-bar.service';
import { OfferDetailViewService } from '@app/services/offer-detail-view.service';
import { OffersolutioningService } from '@app/services/offersolutioning.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AccessManagementService } from '@app/services/access-management.service';
import { StrategyReviewService } from '@app/services/strategy-review.service';
import { MMAttributes } from '@app/models/mmattributes';
import * as _ from 'lodash';
import { User } from '@app/models/user';
import { ConfigurationService } from '@app/core/services/configuration.service';

@Component({
  selector: 'app-mm-assesment',
  templateUrl: './mm-assesment.component.html',
  styleUrls: ['./mm-assesment.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class MmAssesmentComponent implements OnInit {

  offerData: any;
  offerBuilderdata = {};

  caseId: string;
  offerId: string;
  offerName: string;
  offerOwner: string;
  currentOfferId: string;

  primaryBE: string;
  derivedMM: string;
  displayLeadTime = false;
  noOfWeeksDifference: string;

  message = {};
  stakeholders = {};
  existingStakeHolders: Array<any> = [];

  groupData = [];
  groupNames = [];
  activeTabIndex = 0;
  selectedGroupData = [];

  readOnly = false;
  canClickTab = false;
  changeInMM = false;
  canClickNextStep = false;
  canMarkComplete = false;
  // currentURL: String;
  markCompleteStatus: boolean;
  showMarkcompleteToggle: boolean;
  backbuttonStatusValid = true;
  dimensionMode: Boolean = false;
  dimensionFirstGroupData: Object;
  dimensionFirstGroupName: string;

  showDialog: boolean;
  showErrorDialog: boolean;
  isChangedAttribute: boolean;
  totalApprovalsCount: Number = 0;
  public isAllowedtoNextStep: Boolean = false;

  // --------------------------------------------------------------------------------------------


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private monetizationModelService: MonetizationModelService,
    private offerPhaseService: OfferPhaseService,
    private offerDetailViewService: OfferDetailViewService,
    private configurationService: ConfigurationService,
    private offersolutioningService: OffersolutioningService,
    private rightPanelService: RightPanelService,
    private stakeholderfullService: StakeholderfullService,
    private accessMgmtService: AccessManagementService,
    private strategyReviewService: StrategyReviewService
  ) {
    // this.currentURL = activatedRoute.snapshot['_routerState'].url;
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
    });
   
  }

  // --------------------------------------------------------------------------------------------

  ngOnInit() {

    if (this.router.url.match(/offerDimension/) !== null) {
      this.dimensionMode = true;
    }

    console.log('is dimension mode:: '+this.dimensionMode);
    if (this.dimensionMode) {
      this.canClickTab = true;
    }

    this.readOnly = this.configurationService.startupData.readOnly;


    // Retrieve Offer Details
    // Get Attributes Of Each Group
    // Retrieve Manually Added Stake Holder Data
    // Retrieve MM Model Aligned Info and Update Message Info
    this.offerDetailViewService.retrieveOfferDetails(this.currentOfferId).subscribe(offerBuilderdata => {

      const selectedCharacteristics = {};
      this.offerBuilderdata = offerBuilderdata;

      this.offerId = this.currentOfferId;
      this.offerBuilderdata['BEList'] = [];
      this.offerBuilderdata['BUList'] = [];

      this.offerName = offerBuilderdata['offerName'];
      this.derivedMM = offerBuilderdata['derivedMM'];

      this.offerOwner = offerBuilderdata['offerOwner'];
      this.derivedMM = this.offerBuilderdata['derivedMM'];
      this.primaryBE = this.offerBuilderdata['primaryBEList'][0];

      this.existingStakeHolders = this.offerBuilderdata['stakeholders'] ? this.offerBuilderdata['stakeholders'] : [];

      this.existingStakeHolders = this.existingStakeHolders
        .map(stakeholder => this.formatExistingUserAsStakeholder(stakeholder));


      if (offerBuilderdata['selectedCharacteristics'] != null) {
        offerBuilderdata['selectedCharacteristics'].forEach(selected => {
          if (selectedCharacteristics[selected['group']] == null) {
            selectedCharacteristics[selected['group']] = {};
          }
          if (selectedCharacteristics[selected['group']][selected['subgroup']] == null) {
            selectedCharacteristics[selected['group']][selected['subgroup']] = [];
          }
          selected['characteristics'].forEach(character => {
            selectedCharacteristics[selected['group']][selected['subgroup']].push(character);
          });
        });
      }

      if (offerBuilderdata['additionalCharacteristics'] != null) {
        offerBuilderdata['additionalCharacteristics'].forEach(selected => {
          if (selectedCharacteristics[selected['group']] == null) {
            selectedCharacteristics[selected['group']] = {};
          }
          if (selectedCharacteristics[selected['group']][selected['subgroup']] == null) {
            selectedCharacteristics[selected['group']][selected['subgroup']] = [];
          }
          selected['characteristics'].forEach(character => {
            selectedCharacteristics[selected['group']][selected['subgroup']].push(character);
          });
        });
      }


      // mm model and message section
      this.derivedMM = offerBuilderdata['derivedMM'];
      if (offerBuilderdata['derivedMM'] != null && offerBuilderdata['derivedMM'] !== '') {
        this.canClickNextStep = true;
      }

      if (offerBuilderdata['overallStatus'] == null) {
        this.message = {
          contentHead: 'Great Work!',
          content: ' Select the idea offer characteristics below to determine the Monetization Model best aligns to your requirements.',
          color: 'black'
        };
      } else if (offerBuilderdata['overallStatus'] === 'Aligned') {
        this.canClickNextStep = true;
        this.message = {
          contentHead: offerBuilderdata['overallStatus'],
          content: `  Your selected Offer Characteristics indicate that your Offer is fully aligned to ${offerBuilderdata['derivedMM']}`,
          mmModel: offerBuilderdata['derivedMM']
        };
      } else if (offerBuilderdata['overallStatus'] === 'Partially Aligned') {
        this.canClickNextStep = true;
        this.message = {
          contentHead: offerBuilderdata['overallStatus'],
          content: `  Your selected Offer Characteristics indicate that your Offer is partially aligned to ${offerBuilderdata['derivedMM']}.`,
          mmModel: offerBuilderdata['derivedMM']
        };
      } else {
        this.message = {
          contentHead: offerBuilderdata['overallStatus'],
          content: '  Your selection of Offer Characteristics indicate that your Offer is Not Aligned to any of the 7 Monetization Models.'
        };
      }


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



      // Retrieve Offer Dimensions Attributes
      this.monetizationModelService.retrieveOfferDimensionAttributes().subscribe(offerData => {

        this.offerData = offerData;
        this.offerData['groups'] = _.isEmpty(this.offerData['groups']) ? [] : this.offerData['groups'];

        this.offerData['groups'].forEach(group => {
          this.getGroupData(group, selectedCharacteristics);
        });

        if (offerBuilderdata['derivedMM'] != null) {
          let index = 0;
          const groupKeys = this.getGroupKeys(this.groupData[0]);
          groupKeys.forEach((key) => {
            this.offerData['groups'][0]['subGroup'][index]['selected'] = [];
            this.groupData[0][key].forEach((attr) => {
              if (attr.status === 1 || attr.type === 2) {
                this.offerData['groups'][0]['subGroup'][index]['selected'].push(attr.name);
              }
            });
            index += 1;
          });

          this.offerData['offerId'] = this.currentOfferId;
          this.offerData['mmChoice'] = 'REVALIDATE';
          this.offerData['mmId'] = null;
          const postData = this.offerData;
          postData['groups'] = this.offerData['groups'];

          this.monetizationModelService.validateOfferDimension(postData).subscribe(data => {
            this.groupData.splice(1);
            this.groupNames.splice(1);
            data['dimgroups'].forEach(group => {
              this.getGroupData(group, selectedCharacteristics, true);
            });

            if (this.dimensionMode === true) {
              this.groupData.shift();
              this.groupNames.shift();
            }
            this.checkDimensionSubGroup();
          });
        }

        if (this.selectedGroupData.length > 0) {
          alert('no final Group data');
        }

        if (this.dimensionMode === true) {
          // dimension page, remove the first tab
          this.dimensionFirstGroupData = this.groupData[0];
          this.dimensionFirstGroupName = this.groupNames[0];
          this.groupData.shift();
          this.groupNames.shift();

        }

        if (offerBuilderdata['derivedMM'] !== null && offerBuilderdata['derivedMM'] !== '') {
          this.getStakeHolderList();
        }
      });

      // Compute TTM Details
      this.getLeadTimeCalculation();

    });


    this.strategyReviewService.getStrategyReview(this.caseId).subscribe((resStrategyReview) => {
      this.totalApprovalsCount = resStrategyReview.length;
    });

  }


  // --------------------------------------------------------------------------------------------

  getGroupData(group, selectedCharacteristics, toNextSetpFlag = false) {

    if (toNextSetpFlag && group['groupName'] === 'Offer Characteristics') {
      return;
    }

    const curGroup = {};
    this.groupNames.push(group['groupName']);

    group['subGroup'].forEach(g => {

      curGroup[g['subGroupName']] = [];
      g.choices.forEach((c) => {
        const splitArr = c.split('#');
        const attrName = splitArr[0];
        let description = splitArr[1];
        if (description == null || description === '') {
          description = attrName;
        }

        if (selectedCharacteristics[group['groupName']] != null &&
          selectedCharacteristics[group['groupName']][g['subGroupName']] != null &&
          (selectedCharacteristics[group['groupName']][g['subGroupName']].includes(c)
            || selectedCharacteristics[group['groupName']][g['subGroupName']]
              .includes(attrName))
        ) {
          curGroup[g['subGroupName']].push({ name: attrName, type: 0, status: 1, tooltip: description });
        } else {
          curGroup[g['subGroupName']].push({ name: attrName, type: 0, status: -1, tooltip: description });
        }
      });
    });
    this.groupData.push(curGroup);
  }

  // Attributes Selection Rules

  getSubgroupAttributes(curGroup, groupName) {

    const res = [];
    const offerComponentAttrs = curGroup[groupName];

    offerComponentAttrs.forEach(function (attr) {
      if (attr.status === 1) {
        res.push(attr.name);
      }
    });
    return res;
  }

  clearSubGroupType(curGroup) {
    curGroup['Hosting Party'].forEach((attr) => {
      attr.type = 0;
    });
    curGroup['Deployment'].forEach((attr) => {
      attr.type = 0;
    });
    curGroup['Delivery'].forEach((attr) => {
      attr.type = 0;
    });
    curGroup['Licensing'].forEach((attr) => {
      attr.type = 0;
    });
  }

  changeSubGroupType(curGroup) {

    const selectedAttrs = this.getSubgroupAttributes(curGroup, 'Offer Components');
    this.clearSubGroupType(curGroup);

    if (selectedAttrs.length === 1 && selectedAttrs.indexOf('SW - SaaS') !== -1) {
      const perpetual = curGroup['Licensing'].find(obj => {
        return obj.name === 'Perpetual';
      });
      perpetual.type = 1;

      curGroup['Delivery'].forEach((attr) => {
        if (attr.name === 'Provisioning Fulfillment') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      curGroup['Deployment'].forEach((attr) => {
        if (attr.name === 'Cloud') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });
    } else if (selectedAttrs.includes('SW - SaaS') && (selectedAttrs.includes('Hardware (Commodity (x86) / Proprietary)')
      || selectedAttrs.includes('SW - OS') || selectedAttrs
        .includes('SW - OS Feature / Application / 3rd Part SW / VNF'))) {
      curGroup['Delivery'].forEach((attr) => {
        if (attr.name === 'Provisioning Fulfillment') {
          attr.type = 2;
        }
      });

      curGroup['Deployment'].forEach((attr) => {
        if (attr.name === 'Hybrid') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else if (selectedAttrs.includes('Hardware (Commodity (x86) / Proprietary)') && (selectedAttrs.includes('SW - OS')
      || selectedAttrs.includes('SW - OS Feature / Application / 3rd Part SW / VNF'))) {
      curGroup['Hosting Party'].forEach((attr) => {
        if (attr.name === 'Hosting Party - N/A') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      curGroup['Delivery'].forEach((attr) => {
        if (attr.name === 'Provisioning Fulfillment') {
          attr.type = 1;
        }
      });

      curGroup['Deployment'].forEach((attr) => {
        if (attr.name === 'On-Premise') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else if (selectedAttrs.length === 1 && selectedAttrs.includes('Hardware (Commodity (x86) / Proprietary)')) {

      curGroup['Hosting Party'].forEach((attr) => {
        if (attr.name === 'Hosting Party - N/A') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      curGroup['Delivery'].forEach((attr) => {
        if (attr.name === 'Physical Fulfillment') {
          attr.type = 2;
        }
      });

      curGroup['Deployment'].forEach((attr) => {
        if (attr.name === 'On-Premise') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else if (selectedAttrs.includes('SW - OS') || selectedAttrs.includes('SW - OS Feature / Application / 3rd Part SW / VNF')) {

      curGroup['Hosting Party'].forEach((attr) => {
        if (attr.name === 'Hosting Party - N/A') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      curGroup['Deployment'].forEach((attr) => {
        if (attr.name === 'On-Premise') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else {
      this.clearSubGroupType(curGroup);
    }

  }

  toggleSelected(attribute) {

    // In MM Page, toggle select
    if (this.dimensionMode !== true) {

      if (this.readOnly === false) {
        this.isChangedAttribute = true;
        if (attribute.type === 2 && attribute.status === -1) {
          attribute.type = 0;
          this.canClickNextStep = false;
        }
        attribute.status = -attribute.status;
        // In MM page, Set Condition To Enable Next Step Button
        if (this.activeTabIndex === 0 && this.dimensionMode !== true) {
          if (this.groupData[0]['Offer Components'].includes(attribute)) {
            this.changeSubGroupType(this.groupData[0]);
          }

          let next = 0;
          const groupKeys = this.getGroupKeys(this.groupData[this.activeTabIndex]);
          groupKeys.forEach(key => {
            for (const attr of this.groupData[0][key]) {
              if (attr.status === 1 || attr.type === 2) {
                next += 1;
                break;
              }
            }
          });
          if (next === groupKeys.length) {
            this.canClickNextStep = true;
          } else {
            this.canClickNextStep = false;
          }
        }
        this.selectedGroupData = this.groupData;

      }
    }

    // In dimension Mode,toggle select and other condition check

    if (this.dimensionMode === true) {

      if (this.readOnly === false && this.markCompleteStatus === false) {
        this.isChangedAttribute = true;
        if (attribute.type === 2 && attribute.status === -1) {
          attribute.type = 0;
          this.canClickNextStep = false;
        }
        attribute.status = -attribute.status;

        this.checkDimensionSubGroup();


        this.selectedGroupData = this.groupData;

      }
    }

  }



  // --------------------------------------------------------------------------------------------



  updateMessage(message) {

    if (message != null && message !== '') {
      if (message === 'hold') {
        this.backbuttonStatusValid = false;
        this.message = {
          contentHead: '',
          content: 'The Offer has been placed on hold. All the stakeholders will be notified about the update status of the Offer.',
          color: 'black'
        };
      } else if (message === 'cancel') {
        this.backbuttonStatusValid = false;
        this.message = {
          contentHead: '',
          content: 'The Offer has been cancelled. All the stakeholders will be notified about the update status of the Offer.',
          color: 'black'
        };
      }
    }
  }

  getGroupKeys(obj) {
    if (typeof obj === 'object') {
      return Object.keys(obj);
    } else {
      return [];
    }
  }



  changeTab(index) {
    if (this.canClickNextStep === true) {
      this.activeTabIndex = index;
      if (index === 0 && !this.dimensionMode) {
        this.canClickTab = false;
      }
    }
  }


  // --------------------------------------------------------------------------------------------

  showDialogBox() {
    if (this.totalApprovalsCount > 0 && this.isChangedAttribute) {
      this.showDialog = true;
    } else {
      this.toNextStep();
    }

  }

  // --------------------------------------------------------------------------------------------

  toPrevStep() {
    if (this.activeTabIndex > 0) {
      this.activeTabIndex -= 1;
      if (this.activeTabIndex === 0 && !this.dimensionMode) {
        this.canClickTab = false;
      }
    }
  }

  // --------------------------------------------------------------------------------------------

  getStakeHolderList() {


    this.stakeholders = {};

    // Update StakeHolder Array
    this.monetizationModelService.retrieveDefaultStakeHolders(this.derivedMM, this.primaryBE).subscribe(defaultStakeholdersObj => {

      // Retrieve Default Stake Holders Details Related To Current Offer
      const defaultStakeholders = defaultStakeholdersObj as Array<User>;

      // Retrieve Owner Of Current Offer
      this.accessMgmtService.retrieveUserInfo(this.offerOwner).subscribe(ownerInfo => {

        // Map Owner To User Format
        this.stakeholders = this.formFinalStakeHolderList(ownerInfo, defaultStakeholders);

      });


    });

  }

  private formFinalStakeHolderList(ownerInfo: any, defaultStakeholders: User[]) {

    let finalStakeHoldersList = {};

    // Format Owner
    const owner = this.formatDefaultUserAsStakeholder(ownerInfo);

    // Add Owner Details To Final Stakeholder List
    finalStakeHoldersList['Owner'] = [owner];

    // Add Existing Stakeholders To Final List
    finalStakeHoldersList = this.groupStakeHoldersBasedOnFunctionRole(finalStakeHoldersList);

    // Add stakeholderDefaults tag
    defaultStakeholders = defaultStakeholders.map(function (stakeholders) {
      return {
        ...stakeholders,
        stakeholderDefaults: true,
      };
    });

    // Combine Default and Manually Added Stakeholder To Form Final List
    finalStakeHoldersList = this.compareAndAddNewStakeHolders(defaultStakeholders, finalStakeHoldersList);

    // Return Final Stake Holder List
    return finalStakeHoldersList;

  }

  // --------------------------------------------------------------------------------------------

  private formatStakeHolderOwnerToUpdateOffer(user: User): any {
    return {
      '_id': user['userId'],
      'businessEntity': user['userMapping'][0]['businessEntity'],
      'functionalRole': user['userMapping'][0]['functionalRole'],
      'offerRole': (user['_id'] === this.offerBuilderdata['offerOwner'])
        ? 'Owner' : user['userMapping'][0]['functionalRole'],
      'stakeholderDefaults': true,
      'name': user['userName']
    };
  }

  private transformStakeHolderInfo(totalCombinedStakeHolders: any) {

    this.stakeholders = [];

    totalCombinedStakeHolders.forEach(stakeHolder => {

      if (this.stakeholders[stakeHolder['offerRole']] == null) {
        this.stakeholders[stakeHolder['offerRole']] = [];
      }

      // Stake Holder Info To Display Acc 2 Functional Role On UI
      this.stakeholders[stakeHolder['offerRole']].push({
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
    });
  }

  private formatStakeHolderPojoToUpdateOffer_1(user: User, defaultStakeHolder: boolean) {

    const stakeHolderUpdateOfferFormat = [];

    for (const functionalRole of Object.keys(this.stakeholders)) {
      this.stakeholders[functionalRole]
        .map((currentStakeHolder: User) => {
          stakeHolderUpdateOfferFormat.push(this.formatStakeHolderPojoToUpdateOffer(currentStakeHolder, defaultStakeHolder));
        });
    }
    return stakeHolderUpdateOfferFormat;
  }

  private formatStakeHolderPojoToUpdateOffer(user: User, defaultStakeHolder: boolean): any {
    return {
      '_id': user['_id'],
      'businessEntity': user['userMappings'][0]['businessEntity'],
      'functionalRole': user['userMappings'][0]['functionalRole'],
      'offerRole': (user['_id'] === this.offerBuilderdata['offerOwner'])
        ? 'Owner' : user['userMappings'][0]['functionalRole'],
      'stakeholderDefaults': defaultStakeHolder ? defaultStakeHolder : (user['stakeholderDefaults'] ? user['stakeholderDefaults'] : false),
      'name': user['userName']
    };
  }

  // --------------------------------------------------------------------------------------------

  private groupStakeHoldersBasedOnFunctionRole(finalStakeHoldersList: {}): any {

    finalStakeHoldersList = this.existingStakeHolders.reduce((stakeHolderAccumulator, currentStakeholder) => {

      if (currentStakeholder._id !== this.offerOwner) {
        const stakeholderFunctionRole = currentStakeholder['userMappings'][0]['functionalRole'];
        stakeHolderAccumulator[stakeholderFunctionRole] = stakeHolderAccumulator[stakeholderFunctionRole]
          && stakeHolderAccumulator[stakeholderFunctionRole].length > 0
          ? stakeHolderAccumulator[stakeholderFunctionRole].concat(currentStakeholder) : [currentStakeholder];
      }

      return stakeHolderAccumulator;

    }, finalStakeHoldersList);

    return finalStakeHoldersList;

  }

  // --------------------------------------------------------------------------------------------

  private formatDefaultUserAsStakeholder(userInfo: any): any {
    return {
      userName: userInfo.userName,
      emailId: userInfo.userId + '@cisco.com',
      _id: userInfo.userId,
      userMappings: [{
        appRoleList: userInfo['userMapping'][0]['appRoleList'] == null ?
          [] : userInfo['userMapping'][0]['appRoleList'],
        businessEntity: userInfo['userMapping'][0]['businessEntity'],
        functionalRole: userInfo['userMapping'][0]['functionalRole'],
        offerRole: userInfo['userMapping'][0]['functionalRole'],
      }
      ],
      stakeholderDefaults: true
    };
  }

  private formatExistingUserAsStakeholder(userInfo: any): any {
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
      stakeholderDefaults: userInfo.stakeholderDefaults ? true : false
    };
  }

  private compareAndAddNewStakeHolders(newStakeHolderList: User[], existingStakeHolderList: {}): {} {

    newStakeHolderList.reduce((stakeHolderAccumulator, currentStakeholder) => {

      const stakeholderFunctionRole = currentStakeholder['userMappings'][0]['functionalRole'];

      // Check If Stakeholder Is Already Present In Existing Stakeholder list
      const isCurrentUserInStakeholders = existingStakeHolderList[stakeholderFunctionRole]
        && existingStakeHolderList[stakeholderFunctionRole].some(stk => stk._id === currentStakeholder._id);

      // Add Stakeholder, If Not Present In Existing Stakholder List
      if (!isCurrentUserInStakeholders) {
        stakeHolderAccumulator[stakeholderFunctionRole] = stakeHolderAccumulator[stakeholderFunctionRole]
          && stakeHolderAccumulator[stakeholderFunctionRole].length > 0 ?
          stakeHolderAccumulator[stakeholderFunctionRole].concat(currentStakeholder) : [currentStakeholder];
      }

      return stakeHolderAccumulator;
    }, existingStakeHolderList);

    return existingStakeHolderList;

  }

  // --------------------------------------------------------------------------------------------

  private getLeadTimeCalculation() {
    this.rightPanelService.displayAverageWeeks(this.primaryBE, this.derivedMM).subscribe((leadTime) => {
      this.noOfWeeksDifference = Number(leadTime['averageOverall']).toFixed(1);
      this.displayLeadTime = true;
    }, () => {
      this.noOfWeeksDifference = 'N/A';
    });
  }

  // --------------------------------------------------------------------------------------------

  toNextStep() {


    this.isAllowedtoNextStep = true;

    if (this.activeTabIndex === 0 && !this.dimensionMode) {

      this.canClickTab = true;
      let index = 0;
      const groupKeys = this.getGroupKeys(this.groupData[0]);
      groupKeys.forEach((key) => {
        this.offerData['groups'][0]['subGroup'][index]['selected'] = [];
        this.groupData[0][key].forEach((attr) => {
          if (attr.status === 1 || attr.type === 2) {
            this.offerData['groups'][0]['subGroup'][index]['selected'].push(attr.name);
          }
        });
        index += 1;
      });
      this.offerData['offerId'] = this.currentOfferId;
      this.offerData['mmChoice'] = 'REVALIDATE';
      this.offerData['mmId'] = null;
      const postData = this.offerData;
      postData['groups'] = this.offerData['groups'];


      // Validate Offer Dimensions
      this.monetizationModelService.validateOfferDimension(postData).subscribe(data => {

        let tempMessage: any = {};

        if (data['mmMapperStatus'] === 'Aligned') {
          tempMessage = {
            contentHead: data['mmMapperStatus'],
            content: `  Your selected Offer Characteristics indicate that your Offer is fully aligned to ${data['mmModel']}`,
            mmModel: data['mmModel']
          };
        } else if (data['mmMapperStatus'] === 'Partially Aligned') {
          tempMessage = {
            contentHead: data['mmMapperStatus'],
            content: `  Your selected Offer Characteristics indicate that your Offer is partially aligned to ${data['mmModel']}.`,
            mmModel: data['mmModel']
          };
        } else {
          tempMessage = {
            contentHead: data['mmMapperStatus'],
            content: ' Your selection of Offer Characteristics indicate that your Offer is Not Aligned to any of the 7 Monetization Models.'
          };
        }

        if (this.totalApprovalsCount > 0 && this.isChangedAttribute && (tempMessage['contentHead'] !== this.message['contentHead']
          || tempMessage['content'] !== this.message['content'])) {
          this.showDialog = true;
          return;
        }

        if (this.activeTabIndex < this.groupNames.length - 1) {
          this.activeTabIndex += 1;
        }

        if (this.derivedMM !== data['mmModel']) {
          this.changeInMM = true;
          this.groupData.splice(1);
          this.groupNames.splice(1);
          this.message = tempMessage;
          this.derivedMM = data['mmModel'];
          data['dimgroups'].forEach(group => {
            this.getGroupData(group, {}, true);
          });
        }

        this.proceedToStakeholder('false');

      });



    } else {
      if (this.activeTabIndex < this.groupNames.length - 1) {
        this.activeTabIndex += 1;
      }
    }


    if (this.dimensionMode === false) {
      this.proceedToStakeholder('false');
    } else {
      this.proceedToOfferSolution('false');
    }

  }

  // --------------------------------------------------------------------------------------------

  proceedToStakeholder(withRouter: string = 'true') {


    this.stakeholders = {};
    this.existingStakeHolders = [];
    let selectedCharacteristics = [];
    let additionalCharacteristics = [];

    // Find Additional & Selected Characterstics Related To Given Offer
    [selectedCharacteristics, additionalCharacteristics] = this.findAdditionalAndSelectedCharacterstics(this.groupNames, this.groupData);

    // Populate Paramters Needed To Update Offer Details

    const proceedToStakeholderPostData = {};

    proceedToStakeholderPostData['status'] = {
      'offerPhase': 'PreLaunch',
      'offerMilestone': 'Launch In Progress',
      'phaseMilestone': 'ideate',
      'subMilestone': 'Offer Model Evaluation'
    };

    proceedToStakeholderPostData['ideate'] = [{
      'subMilestone': 'Offer Model Evaluation',
      'status': 'completed',
      'completionDate': new Date().toDateString(),
    }];



    // Retrieve Existing Stake Holders Details From Current Offer
    this.stakeholderfullService.retrieveOfferDetails(this.currentOfferId).subscribe(offerDetailsData => {

      this.existingStakeHolders = offerDetailsData['stakeholders'] ? offerDetailsData['stakeholders'] : [];
      this.existingStakeHolders = _.uniqBy(this.existingStakeHolders, '_id');

      // When change in MM is true, remove default stakeholders from existing list
      if (this.changeInMM) {
        this.changeInMM = false;
        this.existingStakeHolders = this.existingStakeHolders
          .filter(stakeholder => !stakeholder.stakeholderDefaults);
      }

      // Convert Users To Default Format
      this.existingStakeHolders = this.existingStakeHolders
        .map(stakeholder => this.formatExistingUserAsStakeholder(stakeholder));


      // Update StakeHolder Array
      this.monetizationModelService.retrieveDefaultStakeHolders(this.derivedMM, this.primaryBE).subscribe(defaultStakeholdersObj => {

        // Retrieve Default Stake Holders Details Related To Current Offer
        const defaultStakeholders = defaultStakeholdersObj as Array<User>;

        // Retrieve Owner Of Current Offer
        this.accessMgmtService.retrieveUserInfo(this.offerOwner).subscribe(ownerInfo => {

          // Form Final Stake Holder List
          this.stakeholders = this.formFinalStakeHolderList(ownerInfo, defaultStakeholders);

          // Populate Update Offer Details Request
          proceedToStakeholderPostData['overallStatus'] = this.message['contentHead'];
          proceedToStakeholderPostData['derivedMM'] = this.derivedMM == null ? '' : this.derivedMM;
          proceedToStakeholderPostData['stakeholders'] = this.formatStakeHolderPojoToUpdateOffer_1(_, false);
          proceedToStakeholderPostData['offerId'] = this.currentOfferId == null ? '' : this.currentOfferId;

          if (this.isAllowedtoNextStep) {
            proceedToStakeholderPostData['selectedCharacteristics'] = selectedCharacteristics;
            proceedToStakeholderPostData['additionalCharacteristics'] = additionalCharacteristics;
          }

          // Update Offer Details
          this.monetizationModelService.updateOfferDetails(proceedToStakeholderPostData).subscribe(() => {

            const proceedPayload = {
              'taskId': '',
              'userId': this.offerBuilderdata['offerOwner'],
              'caseId': this.caseId,
              'offerId': this.currentOfferId,
              'taskName': 'Offer MM',
              'action': '',
              'comment': ''
            };
            if (this.isAllowedtoNextStep) {
              this.offerPhaseService.createSolutioningActions(proceedPayload).subscribe(() => {
                if (JSON.parse(withRouter) === true) {
                  this.router.navigate(['/stakeholderFull', this.currentOfferId, this.caseId]);
                }
              });
            } else {
              this.router.navigate(['/stakeholderFull', this.currentOfferId, this.caseId]);
            }
          });


        });

      });

    }, (err) => {
      if (JSON.parse(withRouter) === true) {
        this.router.navigate(['/stakeholderFull', this.currentOfferId, this.caseId]);
      }
    });

  }


  // --------------------------------------------------------------------------------------------

  proceedToOfferSolution(withRouter: string = 'true') {


    const groups = [];
    let groupDataWithFirst = [];
    let groupNamesWithFirst = [];

    groupDataWithFirst.push(this.dimensionFirstGroupData);
    groupDataWithFirst = groupDataWithFirst.concat(this.groupData);

    groupNamesWithFirst.push(this.dimensionFirstGroupName);
    groupNamesWithFirst = groupNamesWithFirst.concat(this.groupNames);

    groupDataWithFirst.forEach((group, index) => {
      const curGroup = {};
      curGroup['groupName'] = groupNamesWithFirst[index];
      curGroup['subGroup'] = [];
      for (const prop of Object.keys(group)) {
        const curSubGroup = {};
        curSubGroup['subGroupName'] = prop;
        curSubGroup['subGroupStatus'] = this.message['contentHead'];
        curSubGroup['failed'] = null;
        curSubGroup['choices'] = [];
        curSubGroup['selected'] = [];

        group[prop].forEach((characters) => {
          if (characters['status'] === 1 || characters['type'] === 2) {
            curSubGroup['selected'].push(characters['name']);
          }
          curSubGroup['choices'].push(characters['name']);
        });
        curGroup['subGroup'].push(curSubGroup);
      }
      groups.push(curGroup);
    });

    const postOfferSolutioningData = {};
    postOfferSolutioningData['groups'] = groups;
    postOfferSolutioningData['mmMapperStatus'] = this.message['contentHead'];
    postOfferSolutioningData['mmModel'] = this.derivedMM == null ? '' : this.derivedMM;
    postOfferSolutioningData['offerId'] = this.currentOfferId == null ? '' : this.currentOfferId;
    postOfferSolutioningData['functionalRole'] = this.configurationService.startupData.functionalRole[0];

    // REST API - /setOfferSolutioning
    this.offersolutioningService.postForOfferSolutioning(postOfferSolutioningData).subscribe(result => {

      const postRuleResultData = result;
      postRuleResultData['offerId'] = this.currentOfferId;

      // REST API - /validateDimensionInfo
      this.monetizationModelService.retrieveOfferDimensionInfo(postRuleResultData).subscribe(() => { });

      let selectedCharacteristics = [];
      let additionalCharacteristics = [];

      // Find Additional & Selected Characterstics Related To Given Offer
      [selectedCharacteristics, additionalCharacteristics] =
        this.findAdditionalAndSelectedCharacterstics(groupNamesWithFirst, groupDataWithFirst);

      // Find Monetization Attributes Selected By Offer Owner / Co-Owner
      const selectedMonetizationAttributes: MMAttributes[] = this.retrieveSelectedOfferAtrributes
        (additionalCharacteristics, selectedCharacteristics);

      // Retrieve Existing Stake Holders Details From Current Offer
      this.stakeholderfullService.retrieveOfferDetails(this.currentOfferId).subscribe(offerDetailsData => {

        let existingStakeHolders = offerDetailsData['stakeholders'];

        // Retrieve Owner Details  Of From Current Offer
        this.accessMgmtService.retrieveUserInfo(this.offerOwner).subscribe(ownerInfo => {

          // Map Owner To User Format
          const owner = this.formatStakeHolderOwnerToUpdateOffer(ownerInfo);
          existingStakeHolders.push(owner);

          // 1. Update Offer Details
          // 2. Populate Existing StakeHolder List With New Stake Holder Related To Selected Attribute
          this.monetizationModelService.
            retrieveStakeHoldersRelatedToSelectedAttributes(this.primaryBE, selectedMonetizationAttributes)
            .subscribe(stakeHolderRelatedToSelectedAttributesList => {

              // Add Stakeholders Related To Attribute When Proceed To Offer Solutioning
              if (JSON.parse(withRouter) === true) {
                const stakeHolderRelatedToSelectedAttributes = stakeHolderRelatedToSelectedAttributesList
                  .map(user => this.formatStakeHolderPojoToUpdateOffer(user, true));
                existingStakeHolders = existingStakeHolders.concat(stakeHolderRelatedToSelectedAttributes);
              }

              // Remove Duplicate Stakeholders
              existingStakeHolders = _.uniqBy(existingStakeHolders, '_id');

              // Transform StakeHolder Info To Display On UI
              if (!_.isEmpty(existingStakeHolders)) {
                this.transformStakeHolderInfo(existingStakeHolders);
              }

              // Populate Paramters Needed To Update Offer Details
              const proceedToStakeholderPostData = {};
              proceedToStakeholderPostData['solutioningDetails'] = [];
              proceedToStakeholderPostData['stakeholders'] = existingStakeHolders;
              proceedToStakeholderPostData['selectedCharacteristics'] = selectedCharacteristics;
              proceedToStakeholderPostData['additionalCharacteristics'] = additionalCharacteristics;
              proceedToStakeholderPostData['offerId'] = this.currentOfferId == null ? '' : this.currentOfferId;

              // Populate Solutioning Details
              result['groups'].forEach(group => {

                group['subGroup'].forEach(subGroup => {

                  const solutioningDetail = {
                    'dimensionGroup': group['groupName'],
                    'dimensionSubgroup': subGroup['subGroupName'],
                    'dimensionAttribute': subGroup['selected'],
                    'primaryFunctions': [],
                    'secondaryFunctions': [],
                    'Details': []
                  };

                  if (subGroup['listGrpQuestions'] != null && subGroup['listGrpQuestions'].length > 0) {

                    subGroup['listGrpQuestions'].forEach(question => {
                      const detail = {
                        'solutioninQuestion': question['question'],
                        'egenieAttributeName': question['egineAttribue'],
                        'oSGroup': question['osGroup']
                      };
                      solutioningDetail['primaryFunctions'] = subGroup['listGrpQuestions'][0]['primaryPOC'];
                      solutioningDetail['secondaryFunctions'] = subGroup['listGrpQuestions'][0]['secondaryPOC'];
                      solutioningDetail['Details'].push(detail);
                    });

                  }

                  proceedToStakeholderPostData['solutioningDetails'].push(solutioningDetail);

                });
              });


              // Update Offer details
              this.monetizationModelService.updateOfferDetails(proceedToStakeholderPostData).subscribe(() => {

                const dimensionProceedPayload = {
                  'taskId': '',
                  'userId': this.offerBuilderdata['offerOwner'],
                  'caseId': this.caseId,
                  'offerId': this.currentOfferId,
                  'taskName': 'Offer Dimension',
                  'action': '',
                  'comment': ''
                };

                // Need to select atleast one subgroup characteristic from offer dimension to enable request approval button.
                let offerDimensionSelected = true;
                proceedToStakeholderPostData['additionalCharacteristics'].forEach(element => {
                  if (element.characteristics.length === 0) {
                    offerDimensionSelected = false;
                  }
                });

                if (offerDimensionSelected) {
                  this.offerPhaseService.createSolutioningActions(dimensionProceedPayload).subscribe(result => {
                    this.offersolutioningService.saveSolutionData(this.currentOfferId, result);
                    if (JSON.parse(withRouter) === true) {
                      this.router.navigate(['/offerSolutioning', this.currentOfferId, this.caseId]);
                    }
                  });
                } else {
                  if (JSON.parse(withRouter) === true) {
                    this.router.navigate(['/offerSolutioning', this.currentOfferId, this.caseId]);
                  }
                }
              });

            }, (err) => {

              console.log(err);

            });

        });

      });

    });
  }

  // --------------------------------------------------------------------------------------------


  private retrieveSelectedOfferAtrributes(additionalCharacteristics: any[], selectedCharacteristics: any[]) {

    // Find Additional characteristics for current offer
    const additionalCharactersticsAttributes: MMAttributes[] = additionalCharacteristics
      .filter(mmAttribute => !_.isEmpty(mmAttribute.characteristics))
      .map(function (mmAttribute) {
        return new MMAttributes(mmAttribute.group, mmAttribute.subgroup, mmAttribute.characteristics);
      });

    // Find Selected characteristics for current offer
    const selectedCharactersrticsAttributes: MMAttributes[] = selectedCharacteristics
      .filter(mmAttribute => !_.isEmpty(mmAttribute.characteristics))
      .map(function (mmAttribute) {
        return new MMAttributes(mmAttribute.group, mmAttribute.subgroup, mmAttribute.characteristics);
      });

    // Combine Additional and Selected Characterstics 
    selectedCharactersrticsAttributes.forEach(offerChars => {
      additionalCharactersticsAttributes.push(offerChars);
    });

    return additionalCharactersticsAttributes;

  }

  // --------------------------------------------------------------------------------------------

  private findAdditionalAndSelectedCharacterstics(groupNames: any, groupData: any): any {

    const selectedCharacteristics: any[] = [];
    const additionalCharacteristics: any[] = [];

    groupData.forEach((group, index) => {
      for (const subGroup of Object.keys(group)) {

        const subselectedCharacteristics = {};
        const notSubselectedCharacteristics = {};
        subselectedCharacteristics['subgroup'] = subGroup;
        notSubselectedCharacteristics['subgroup'] = subGroup;
        subselectedCharacteristics['characteristics'] = [];
        notSubselectedCharacteristics['characteristics'] = [];
        subselectedCharacteristics['group'] = groupNames[index];
        notSubselectedCharacteristics['group'] = groupNames[index];
        subselectedCharacteristics['alignmentStatus'] = this.message['contentHead'];
        notSubselectedCharacteristics['alignmentStatus'] = this.message['contentHead'];

        group[subGroup].forEach((characters) => {
          if (characters['status'] === 1 || characters['type'] === 2) {
            subselectedCharacteristics['characteristics'].push(characters['name']);
          } else {
            notSubselectedCharacteristics['characteristics'].push(characters['name']);
          }
        });

        if (index === 0) {
          selectedCharacteristics.push(subselectedCharacteristics);
        } else {
          additionalCharacteristics.push(subselectedCharacteristics);
        }
      }
    });

    return [selectedCharacteristics, additionalCharacteristics];

  }

  // --------------------------------------------------------------------------------------------

  onStrategyReview() {
    this.router.navigate(['/strategyReview', this.currentOfferId]);
  }

  goBackToOffercreation() {
    this.router.navigate(['/coolOffer', this.currentOfferId, this.caseId]);
  }

  goBackToStrategyReview() {
    this.router.navigate(['/strategyReview', this.currentOfferId, this.caseId]);
  }

  gotoOfferviewDetails() {
    this.router.navigate(['/offerDetailView', this.currentOfferId, this.caseId]);
  }

  // --------------------------------------------------------------------------------------------
  // Check Dimension at least select one attribute in each subGroup
  checkDimensionSubGroup() {
    //  In Dimension Mode, Set Condition To Enable The Mark Complete Button
    let next = 0;
    let subGroupLength = 0;
    this.groupData.forEach(groupObj => {
      const groupKeys = this.getGroupKeys(groupObj);
      subGroupLength += groupKeys.length;
      groupKeys.forEach(key => {
        for (const attr of groupObj[key]) {
          if (attr.status === 1 || attr.type === 2) {
            next += 1;
            break;
          }
        }
      });
    })
    if (next === subGroupLength) {
      this.canMarkComplete = true;

    } else {
      this.canMarkComplete = false;
    }
  }

  getMarkCompleteStatus(status) {
    console.log('status in getMarkCompleteStatus() MM is:: '+status);
    this.markCompleteStatus = status;
  }


}