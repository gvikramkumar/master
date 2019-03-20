import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { MonetizationModelService } from '../services/monetization-model.service';
import { OfferPhaseService } from '../services/offer-phase.service';
import { ConfigurationService } from '@shared/services';
import { OfferDetailViewService } from '../services/offer-detail-view.service';
import { OffersolutioningService } from '../services/offersolutioning.service';
import { RightPanelService } from '../services/right-panel.service';
import { StakeholderfullService } from '../services/stakeholderfull.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AccessManagementService } from '../services/access-management.service';
import { StrategyReviewService } from '../services/strategy-review.service';
import { MMAttributes } from '@app/models/mmattributes';
import * as _ from 'lodash';
import { User } from '@app/models/user';

@Component({
  selector: 'app-mm-assesment',
  templateUrl: './mm-assesment.component.html',
  styleUrls: ['./mm-assesment.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class MmAssesmentComponent implements OnInit {

  public model: any;
  public firstData: any = new Array();
  public data: any[];
  aligned: boolean;
  proceedFlag = false;
  alignedFlag = false;
  subscription: Subscription;
  offerData: any;
  currentOfferId;
  caseId;
  bviewDeckData: any[];
  choiceSelected;
  groupData = [];
  selectedGroupData = [];
  groupNames = [];
  activeTabIndex = 0;
  message = {};

  offerId: string;
  offerName: string;
  offerOwner: string;

  primaryBE: string;
  derivedMM: string;
  offerBuilderdata = {};
  displayLeadTime = false;
  noOfWeeksDifference: string;

  stakeholders = {};
  Stakeholders: any[] = [];
  currentOfferStakeholders = {};

  canClickNextStep = false;
  canClickTab = false;
  currentMMModel: string = null;
  currentPrimaryBE: any;
  userName;
  eventsSubject: Subject<string> = new Subject<string>();

  setFlag;
  backdropCustom;
  backbuttonStatusValid = true;
  match = false;
  dimensionMode: Boolean = false;
  dimensionFirstGroupData: Object;
  dimensionFirstGroupName: string;
  oldselectedCharacteristics = {};
  disablefields: boolean;
  display: boolean;
  showEditbutton: boolean;
  showWarningSave: boolean;
  showDialog: boolean;
  currentOfferResult: any;
  isChangedAttribute: boolean;
  showErrorDialog: boolean;
  totalApprovalsCount: Number = 0;
  manuallyAddedStakeholders: Array<any> = [];

  // --------------------------------------------------------------------------------------------


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private monetizationModelService: MonetizationModelService,
    private offerPhaseService: OfferPhaseService,
    private offerDetailViewService: OfferDetailViewService,
    private configService: ConfigurationService,
    private offersolutioningService: OffersolutioningService,
    private rightPanelService: RightPanelService,
    private stakeholderfullService: StakeholderfullService,
    private accessMgmtService: AccessManagementService,
    private strategyReviewService: StrategyReviewService
  ) {

    this.display = false;
    this.showEditbutton = false;
    this.showWarningSave = false;
    this.activatedRoute.params.subscribe(params => {

      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });

  }

  // --------------------------------------------------------------------------------------------

  ngOnInit() {

    if (this.router.url.match(/offerDimension/) !== null) {
      this.dimensionMode = true;
    }

    if (this.dimensionMode) {
      this.canClickTab = true;
    }

    // Get Attributes for each group
    this.offerDetailViewService.mmDataRetrive(this.currentOfferId).subscribe(offerDetailRes => {
      const selectedCharacteristics = {};
      if (offerDetailRes['selectedCharacteristics'] != null) {
        offerDetailRes['selectedCharacteristics'].forEach(selected => {
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

      if (offerDetailRes['additionalCharacteristics'] != null) {
        offerDetailRes['additionalCharacteristics'].forEach(selected => {
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

      this.oldselectedCharacteristics = selectedCharacteristics;

      const that = this;

      // mm model and message section
      this.currentMMModel = offerDetailRes['derivedMM'];
      if (offerDetailRes['derivedMM'] != null && offerDetailRes['derivedMM'] !== '') {
        this.canClickNextStep = true;
      }

      if (offerDetailRes['overallStatus'] == null) {
        this.message = {
          contentHead: 'Great Work!',
          content: ' Select the idea offer characteristics below to determine the Monetization Model best aligns to your requirements.',
          color: 'black'
        };
      } else if (offerDetailRes['overallStatus'] === 'Aligned') {
        this.canClickNextStep = true;
        this.message = {
          contentHead: offerDetailRes['overallStatus'],
          content: `  Your selected Offer Characteristics indicate that your Offer is fully aligned to ${offerDetailRes['derivedMM']}`,
          mmModel: offerDetailRes['derivedMM']
        };
      } else if (offerDetailRes['overallStatus'] === 'Partially Aligned') {
        this.canClickNextStep = true;
        this.message = {
          contentHead: offerDetailRes['overallStatus'],
          content: `  Your selected Offer Characteristics indicate that your Offer is partially aligned to ${offerDetailRes['derivedMM']}.`,
          mmModel: offerDetailRes['derivedMM']
        };
      } else {
        this.canClickNextStep = true;
        this.message = {
          contentHead: offerDetailRes['overallStatus'],
          content: '  Your selection of Offer Characteristics indicate that your Offer is Not Aligned to any of the 7 Monetization Models.'
        };
      }

      // Retrieve Offer Details
      this.monetizationModelService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {

        that.offerBuilderdata = data;
        that.offerBuilderdata['BEList'] = [];
        that.offerBuilderdata['BUList'] = [];

        if (that.offerBuilderdata['primaryBEList'] != null) {
          that.offerBuilderdata['BEList'] = that.offerBuilderdata['BEList'].concat(that.offerBuilderdata['primaryBEList']);
        }

        if (that.offerBuilderdata['secondaryBEList'] != null) {
          that.offerBuilderdata['BEList'] = that.offerBuilderdata['BEList'].concat(that.offerBuilderdata['secondaryBEList']);
        }

        if (that.offerBuilderdata['primaryBUList'] != null) {
          that.offerBuilderdata['BUList'] = that.offerBuilderdata['BUList'].concat(that.offerBuilderdata['primaryBUList']);
        }

        if (that.offerBuilderdata['secondaryBUList'] != null) {
          that.offerBuilderdata['BUList'] = that.offerBuilderdata['BUList'].concat(that.offerBuilderdata['secondaryBUList']);
        }

        if (offerDetailRes['derivedMM'] !== null && offerDetailRes['derivedMM'] !== '') {
          this.getStakeData(offerDetailRes['derivedMM']);
        }
      });

      // Retrieve Offer Dimensions Attributes
      this.monetizationModelService.retrieveOfferDimensionAttributes().subscribe(data => {
        that.offerData = data;
        that.offerData['groups'].forEach(group => {
          this.getGroupData(group, selectedCharacteristics);
        });

        if (offerDetailRes['derivedMM'] != null) {
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

          });
        }

        if (this.selectedGroupData.length > 0) {
          alert('no final Group data');
        }

        if (this.dimensionMode === true) {
          // dimension page, remove the first tab
          that.dimensionFirstGroupData = that.groupData[0];
          that.dimensionFirstGroupName = that.groupNames[0];
          that.groupData.shift();
          that.groupNames.shift();
        }


      });
    });

    this.stakeholderfullService.getdata(this.currentOfferId).subscribe(data => {

      this.firstData = data;
      this.currentOfferStakeholders = {};
      this.offerName = data['offerName'];
      this.derivedMM = data['derivedMM'];
      this.offerId = this.currentOfferId;
      this.offerOwner = data['offerOwner'];
      this.data = this.firstData['stakeholders'];
      this.derivedMM = this.firstData['derivedMM'];
      this.primaryBE = this.firstData['primaryBEList'][0];


      this.manuallyAddedStakeholders = this.firstData['stakeholders']
        .filter(stakeholder => !stakeholder.stakeholderDefaults);

      this.manuallyAddedStakeholders = this.manuallyAddedStakeholders
        .map(stakeholder => this.formatManuallyAddedUserAsStakeholder(stakeholder));

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

      if (Object.keys(selectedCharacteristics).length !== 0) {
        this.showEditbutton = true;
        this.disablefields = true;
      }

      curGroup[g['subGroupName']] = [];
      g.choices.forEach((c) => {
        this.match = false;
        const splitArr = c.split('#');
        const attrName = splitArr[0];
        let description = splitArr[1];
        if (description == null || description == '') {
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

    this.isChangedAttribute = true;
    if (attribute.type === 2 && attribute.status === -1) {
      attribute.type = 0;
      this.canClickNextStep = false;
      return;
    }
    attribute.status = -attribute.status;

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

  toNextStep() {

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

        if (this.totalApprovalsCount > 0 && this.isChangedAttribute && (tempMessage['contentHead'] != this.message['contentHead']
          || tempMessage['content'] != this.message['content'])) {
          this.showDialog = true;
          return;
        }

        if (data['mmMapperStatus'] === 'Aligned') {
          this.message = {
            contentHead: data['mmMapperStatus'],
            content: `  Your selected Offer Characteristics indicate that your Offer is fully aligned to ${data['mmModel']}`,
            mmModel: data['mmModel']
          };
        } else if (data['mmMapperStatus'] === 'Partially Aligned') {
          this.message = {
            contentHead: data['mmMapperStatus'],
            content: `  Your selected Offer Characteristics indicate that your Offer is partially aligned to ${data['mmModel']}.`,
            mmModel: data['mmModel']
          };
        } else {
          this.message = {
            contentHead: data['mmMapperStatus'],
            content: ' Your selection of Offer Characteristics indicate that your Offer is Not Aligned to any of the 7 Monetization Models.'
          };
        }

        if (this.activeTabIndex < this.groupNames.length - 1) {
          this.activeTabIndex += 1;
        }
        this.currentPrimaryBE = this.offerBuilderdata['primaryBEList'][0];
        this.getStakeData(data['mmModel']);

        if (this.currentMMModel !== data['mmModel']) {
          this.currentMMModel = data['mmModel'];
          this.groupData.splice(1);
          this.groupNames.splice(1);
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

    this.emitEventToChild();
    this.proceedToStakeholder('false');
  }

  // --------------------------------------------------------------------------------------------

  getStakeData(mmModel) {

    // Initialize Right Panel Component Data
    this.derivedMM = mmModel;
    this.offerId = this.currentOfferId;
    this.primaryBE = this.offerBuilderdata['primaryBEList'][0];

    this.getLeadTimeCalculation();

    this.monetizationModelService.retrieveDefaultStakeHolders(mmModel, this.primaryBE).subscribe(resDefaultStakeholders => {

      this.stakeholders = {};
      let defaultStakeholders;

      if (resDefaultStakeholders) {
        defaultStakeholders = resDefaultStakeholders;
      }

      let finalStakeHoldersList = {};

      this.accessMgmtService.retrieveUserInfo(this.offerOwner).toPromise().then((resOfferOwnerInfo) => {

        const owner = this.formatDefaultUserAsStakeholder(resOfferOwnerInfo);

        // Populate Final Stakeholder List - Owner
        finalStakeHoldersList['Owner'] = [owner];

        // Find manually added stakeholders
        this.manuallyAddedStakeholders.reduce((manualStakeHolderAccumulator, currentStakeholder) => {

          const stakeholder = {
            ...currentStakeholder,
            stakeholderDefaults: false
          };
          const stakeholderFunctionRole = currentStakeholder['userMappings'][0]['functionalRole'];

          manualStakeHolderAccumulator[stakeholderFunctionRole] = manualStakeHolderAccumulator[stakeholderFunctionRole]
            && manualStakeHolderAccumulator[stakeholderFunctionRole].length
            > 0 ? manualStakeHolderAccumulator[stakeholderFunctionRole].concat(stakeholder) : [stakeholder];
          return manualStakeHolderAccumulator;

        }, finalStakeHoldersList);

        // Compare And Populate Final Stakeholder List - Default
        finalStakeHoldersList = this.compareAndAddNewStakeHolders(defaultStakeholders, finalStakeHoldersList);

        this.stakeholders = finalStakeHoldersList;

      });
    });
  }

  // --------------------------------------------------------------------------------------------

  private formatStakeHolderPojoToUpdateOffer_1() {

    let stakeHolderInUpdateOfferFormat = [];

    for (const functionalRole of Object.keys(this.stakeholders)) {

      this.stakeholders[functionalRole]
        .map((currentStakeHolder: User) => {
          stakeHolderInUpdateOfferFormat.push(this.formatStakeHolderPojoToUpdateOffer_2(currentStakeHolder));
        });

      // const stakeHolderFunctionLevel = this.stakeholders[functionalRole]
      //   .reduce((stakeHolderAccumulator, currentStakeHolder: User) => {
      //     stakeHolderAccumulator = stakeHolderAccumulator
      //       .concat(this.formatStakeHolderPojoToUpdateOffer_2(currentStakeHolder));
      //     return stakeHolderAccumulator;
      //   }, []);

      //   stakeHolderInUpdateOfferFormat  = stakeHolderInUpdateOfferFormat.concat(stakeHolderFunctionLevel);
    }
    return stakeHolderInUpdateOfferFormat;
  }

  private formatStakeHolderPojoToUpdateOffer_2(user: User): any {
    return {
      '_id': user['_id'],
      'businessEntity': user['userMappings'][0]['businessEntity'],
      'functionalRole': user['userMappings'][0]['functionalRole'],
      'offerRole': user['userMappings'][0]['functionalRole'] === 'BUPM' && user['_id'] === this.offerBuilderdata['offerOwner']
        ? 'Owner' : user['userMappings'][0]['functionalRole'],
      'stakeholderDefaults': user['stakeholderDefaults'],
      'name': user['userName']
    };
  }

  private formatDefaultUserAsStakeholder(resUserInfo: any): any {
    return {
      userName: resUserInfo.userName,
      emailId: resUserInfo.userId + '@cisco.com',
      _id: resUserInfo.userId,
      userMappings: [{
        appRoleList: [],
        businessEntity: resUserInfo.userMapping[0]['businessEntity'],
        functionalRole: resUserInfo.userMapping[0]['functionalRole'],
        offerRole: resUserInfo.userMapping[0]['functionalRole'],
      }
      ],
      stakeholderDefaults: true
    };
  }

  private formatManuallyAddedUserAsStakeholder(resUserInfo: any): any {
    return {
      userName: resUserInfo.name,
      emailId: resUserInfo._id + '@cisco.com',
      _id: resUserInfo._id,
      userMappings: [{
        appRoleList: [],
        businessEntity: resUserInfo.businessEntity,
        functionalRole: resUserInfo.functionalRole,
        offerRole: resUserInfo.offerRole,
      }
      ],
      stakeholderDefaults: false
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

  emitEventToChild() {
    this.eventsSubject.next(this.offerBuilderdata['offerOwner']);
  }

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

  proceedToStakeholder(withRouter: string = 'true') {

    let selectedCharacteristics = [];
    let additionalCharacteristics = [];

    // Find Additional & Selected Characterstics Related To Given Offer
    [selectedCharacteristics, additionalCharacteristics] = this.
      findAdditionalAndSelectedCharacterstics(selectedCharacteristics, additionalCharacteristics);

    // Find Monetization Attributes Selected By Offer Owner / Co-Owner
    const selectedMonetizationAttributes: MMAttributes[] = additionalCharacteristics
      .filter(mmAttribute => !_.isEmpty(mmAttribute.characteristics))
      .map(function (mmAttribute) {
        return new MMAttributes(mmAttribute.group, mmAttribute.subgroup, mmAttribute.characteristics);
      });

    // 1. Update Offer Details
    // 2. Populate Existing StakeHolder List With New Stake Holder Related To Selected Attribute
    this.monetizationModelService.
      retrieveStakeHoldersRelatedToSelectedAttributes(this.primaryBE, selectedMonetizationAttributes)
      .subscribe(stakeHolderRelatedToSelectedAttributesList => {

        // Compare And Add New StakeHolders To StakeHolder List
        this.stakeholders = this.compareAndAddNewStakeHolders(stakeHolderRelatedToSelectedAttributesList, this.stakeholders);

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


        proceedToStakeholderPostData['overallStatus'] = this.message['contentHead'];
        proceedToStakeholderPostData['selectedCharacteristics'] = selectedCharacteristics;
        proceedToStakeholderPostData['additionalCharacteristics'] = additionalCharacteristics;
        proceedToStakeholderPostData['stakeholders'] = this.formatStakeHolderPojoToUpdateOffer_1();
        proceedToStakeholderPostData['offerId'] = this.currentOfferId == null ? '' : this.currentOfferId;
        proceedToStakeholderPostData['derivedMM'] = this.currentMMModel == null ? '' : this.currentMMModel;

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

          this.offerPhaseService.proceedToStakeHolders(proceedPayload).subscribe(() => {
            if (JSON.parse(withRouter) === true) {
              this.router.navigate(['/stakeholderFull', this.currentOfferId, this.caseId]);
            }
          });

        });


      }, err => {
        console.log('Error Retriving New Stake Holder Related To Selected Attributes');
      });

  }

  // --------------------------------------------------------------------------------------------

  private findAdditionalAndSelectedCharacterstics(selectedCharacteristics: any[], additionalCharacteristics: any[]): any {

    this.groupData.forEach((group, index) => {
      for (const subGroup of Object.keys(group)) {

        const subselectedCharacteristics = {};
        const notSubselectedCharacteristics = {};
        subselectedCharacteristics['subgroup'] = subGroup;
        notSubselectedCharacteristics['subgroup'] = subGroup;
        subselectedCharacteristics['characteristics'] = [];
        notSubselectedCharacteristics['characteristics'] = [];
        subselectedCharacteristics['group'] = this.groupNames[index];
        notSubselectedCharacteristics['group'] = this.groupNames[index];
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
    postOfferSolutioningData['functionalRole'] = this.configService.startupData.functionalRole;
    postOfferSolutioningData['mmModel'] = this.currentMMModel == null ? '' : this.currentMMModel;
    postOfferSolutioningData['offerId'] = this.currentOfferId == null ? '' : this.currentOfferId;

    console.log('postForOfferSolutioning Data:', postOfferSolutioningData);

    // REST API - /setOfferSolutioning
    this.offersolutioningService.postForOfferSolutioning(postOfferSolutioningData).subscribe(result => {

      const postRuleResultData = result;
      postRuleResultData['offerId'] = this.currentOfferId;

      // REST API - /validateDimensionInfo
      this.monetizationModelService.retrieveOfferDimensionInfo(postRuleResultData).subscribe(() => { });

      let selectedCharacteristics = [];
      let additionalCharacteristics = [];

      // Find Additional & Selected Characterstics Related To Given Offer
      [selectedCharacteristics, additionalCharacteristics] = this.
        findAdditionalAndSelectedCharacterstics(selectedCharacteristics, additionalCharacteristics);

      // Find Monetization Attributes Selected By Offer Owner / Co-Owner
      const selectedMonetizationAttributes: MMAttributes[] = additionalCharacteristics
        .filter(mmAttribute => !_.isEmpty(mmAttribute.characteristics))
        .map(function (mmAttribute) {
          return new MMAttributes(mmAttribute.group, mmAttribute.subgroup, mmAttribute.characteristics);
        });

      // 1. Update Offer Details
      // 2. Populate Existing StakeHolder List With New Stake Holder Related To Selected Attribute
      this.monetizationModelService.
        retrieveStakeHoldersRelatedToSelectedAttributes(this.primaryBE, selectedMonetizationAttributes)
        .subscribe(stakeHolderRelatedToSelectedAttributesList => {

          // Compare And Add New StakeHolders To StakeHolder List
          this.stakeholders = this.compareAndAddNewStakeHolders(stakeHolderRelatedToSelectedAttributesList, this.stakeholders);

          // Populate Paramters Needed To Update Offer Details
          const proceedToStakeholderPostData = {};
          proceedToStakeholderPostData['solutioningDetails'] = [];
          proceedToStakeholderPostData['selectedCharacteristics'] = selectedCharacteristics;
          proceedToStakeholderPostData['additionalCharacteristics'] = additionalCharacteristics;
          proceedToStakeholderPostData['stakeholders'] = this.formatStakeHolderPojoToUpdateOffer_1();
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

            this.offerPhaseService.proceedToStakeHolders(dimensionProceedPayload).subscribe(result => {
              this.offersolutioningService.saveSolutionData(this.currentOfferId, result);
              if (JSON.parse(withRouter) === true) {
                this.router.navigate(['/offerSolutioning', this.currentOfferId, this.caseId]);
              }
            });

          });

        });
    });
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

}