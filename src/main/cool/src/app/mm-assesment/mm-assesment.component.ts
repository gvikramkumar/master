import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../shared-service.service';
import { Subscription, Subject } from 'rxjs';
import { CreateOfferService } from '../services/create-offer.service';
import { MonetizationModelService } from '../services/monetization-model.service';
import { OfferPhaseService } from '../services/offer-phase.service';
import { ConfigurationService } from '../services/configuration.service';
import { OfferDetailViewService } from '../services/offer-detail-view.service';
import { OffersolutioningService } from '../services/offersolutioning.service';
import { RightPanelService } from '../services/right-panel.service';
import { LeadTime } from '../right-panel/lead-time';
import { StakeholderfullService } from '../services/stakeholderfull.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AccessManagementService } from '../services/access-management.service';

@Component({
  selector: 'app-mm-assesment',
  templateUrl: './mm-assesment.component.html',
  styleUrls: ['./mm-assesment.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class MmAssesmentComponent implements OnInit {


  public model: any;
  public firstData: any;
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
  withRouter = true;

  offerId: string;
  offerName: string;
  offerOwner: string;

  primaryBE: string;
  derivedMM: string;
  offerBuilderdata = {};
  displayLeadTime = false;
  noOfWeeksDifference: string;

  stakeData = {};
  Stakeholders: any[] = [];
  updatedStakeHolderInfo = {};

  canClickNextStep = false;
  canClickTab = false;
  currentMMModel: string = null;
  currentPrimaryBE: any;
  userName;
  eventsSubject: Subject<string> = new Subject<string>();
  ownerName;
  setFlag;
  backdropCustom;
  proceedButtonStatusValid = false;
  backbuttonStatusValid = true;
  offerArray: any[] = [];
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
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private monetizationModelService: MonetizationModelService,
    private offerPhaseService: OfferPhaseService,
    private offerDetailViewService: OfferDetailViewService,
    private configService: ConfigurationService,
    private offersolutioningService: OffersolutioningService,
    private rightPanelService: RightPanelService,
    private stakeholderfullService: StakeholderfullService,
    private accessMgmtService: AccessManagementService
  ) {

    this.display = false;
    this.showEditbutton = false;
    this.showWarningSave = false;
    this.activatedRoute.params.subscribe(params => {

      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });

  }

  onStrategyReview() {
    this.router.navigate(['/strategyReview', this.currentOfferId]);
  }

  ngOnInit() {

    if (this.router.url.match(/offerDimension/) !== null) {
      this.dimensionMode = true;
    }

    if (this.dimensionMode) {
      this.canClickTab = true;
    }
    this.offerArray = [];
    // Fetch logged in owner name from configurationservice.
    this.ownerName = this.configService.startupData['userName'];


    // Get Attributes for each group
    this.offerDetailViewService.mmDataRetrive(this.currentOfferId).subscribe(offerDetailRes => {
      let selectedCharacteristics = {};
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

      let that = this;

      // mm model and message section
      this.currentMMModel = offerDetailRes['derivedMM'];
      if (offerDetailRes['derivedMM'] != null && offerDetailRes['derivedMM'] !== '') {
        this.canClickNextStep = true;
      }

      if (offerDetailRes['overallStatus'] == null) {
        this.message = { contentHead: 'Great Work!', content: ' Select the idea offer characteristics below to determine the Monetization Model best aligns to your requirements.', color: 'black' };
      } else if (offerDetailRes['overallStatus'] === 'Aligned') {
        this.canClickNextStep = true;
        this.proceedButtonStatusValid = true;
        this.message = { contentHead: offerDetailRes['overallStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is fully aligned to ${offerDetailRes['derivedMM']}`, mmModel: offerDetailRes['derivedMM'] };
      } else if (offerDetailRes['overallStatus'] === 'Partially Aligned') {
        this.canClickNextStep = true;
        this.proceedButtonStatusValid = true;
        this.message = { contentHead: offerDetailRes['overallStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is partially aligned to ${offerDetailRes['derivedMM']}.`, mmModel: offerDetailRes['derivedMM'] };
      } else {
        this.canClickNextStep = true;
        this.proceedButtonStatusValid = true;
        this.message = { contentHead: offerDetailRes['overallStatus'], content: '  Your selection of Offer Characteristics indicate that your Offer is Not Aligned to any of the 7 Monetization Models.' };
      }

      // Retrieve Offer Details
      this.monetizationModelService.getOfferBuilderData(this.currentOfferId).subscribe(data => {

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

      // Get Attributes
      this.monetizationModelService.getAttributes().subscribe(data => {
        that.offerData = data;
        that.offerData['groups'].forEach(group => {
          this.getGroupData(group, selectedCharacteristics);
        });

        if (offerDetailRes['derivedMM'] != null) {
          var index = 0;
          var groupKeys = this.getGroupKeys(this.groupData[0]);
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
          let postData = this.offerData;
          postData['groups'] = this.offerData['groups'];

          this.monetizationModelService.toNextSetp(postData).subscribe(data => {
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
          alert("no final Group data");
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
      this.updatedStakeHolderInfo = {};
      this.offerName = data['offerName'];
      this.derivedMM = data['derivedMM'];
      this.offerId = this.currentOfferId;
      this.offerOwner = data['offerOwner'];
      this.data = this.firstData['stakeholders'];
      this.derivedMM = this.firstData['derivedMM'];
      this.primaryBE = this.firstData['primaryBEList'][0];

      // Retrieve New Stake Holder Info
      for (let i = 0; i <= this.firstData['stakeholders'].length - 1; i++) {

        // Add New Offer Owner (Stake Holder), If Not Present Earlier()
        if (this.updatedStakeHolderInfo[this.firstData['stakeholders'][i]['offerRole']] == null) {
          if (this.firstData['stakeholders'][i]['offerRole'] !== 'Owner') {
            this.updatedStakeHolderInfo[this.firstData['stakeholders'][i]['offerRole']] = [];
          }
        }

        // Populate New Offer Owner (Stake Holder) Details
        this.updatedStakeHolderInfo[this.data[i]['offerRole']].push(
          {
            userName: this.firstData['stakeholders'][i]['name'],
            emailId: this.firstData['stakeholders'][i]['_id'] + '@cisco.com',
            _id: this.firstData['stakeholders'][i]['_id'],
            userMappings: [{
              appRoleList: [],
              businessEntity: this.firstData['stakeholders'][i]['businessEntity'],
              functionalRole: this.firstData['stakeholders'][i]['functionalRole'],
              stakeholderDefaults: this.firstData['stakeholders'][i]['stakeholderDefaults']
            }]
          });

      }

    });

    this.offerPhaseService.getCurrentOfferPhaseInfo(this.caseId).subscribe(result => {
      this.currentOfferResult = result;
    });

  }

  getGroupData(group, selectedCharacteristics, toNextSetpFlag = false) {

    if (toNextSetpFlag && group['groupName'] === 'Offer Characteristics') {
      return;
    }

    let curGroup = {};
    this.groupNames.push(group['groupName']);

    group['subGroup'].forEach(g => {
      if (Object.keys(selectedCharacteristics).length !== 0) {
        this.showEditbutton = true;
        this.disablefields = true;
        this.offerArray = selectedCharacteristics['Offer Characteristics'][g['subGroupName']];
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
          (selectedCharacteristics[group['groupName']][g['subGroupName']].includes(c) || selectedCharacteristics[group['groupName']][g['subGroupName']].includes(attrName))
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

    let res = [];
    let offerComponentAttrs = curGroup[groupName];

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

    let selectedAttrs = this.getSubgroupAttributes(curGroup, 'Offer Components');
    this.clearSubGroupType(curGroup);

    if (selectedAttrs.length === 1 && selectedAttrs.indexOf('SW - SaaS') !== -1) {
      let perpetual = curGroup['Licensing'].find(obj => {
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
    } else if (selectedAttrs.includes('SW - SaaS') && (selectedAttrs.includes('Hardware (Commodity (x86) / Proprietary)') || selectedAttrs.includes('SW - OS') || selectedAttrs.includes('SW - OS Feature / Application / 3rd Part SW / VNF'))) {
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

    } else if (selectedAttrs.includes('Hardware (Commodity (x86) / Proprietary)') && (selectedAttrs.includes('SW - OS') || selectedAttrs.includes('SW - OS Feature / Application / 3rd Part SW / VNF'))) {
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
      return;
    }
    attribute.status = -attribute.status;

    if (this.activeTabIndex === 0 && this.dimensionMode !== true) {
      if (this.groupData[0]['Offer Components'].includes(attribute)) {
        this.changeSubGroupType(this.groupData[0]);
      }

      let next = 0;
      let groupKeys = this.getGroupKeys(this.groupData[this.activeTabIndex]);
      groupKeys.forEach(key => {
        for (let attr of this.groupData[0][key]) {
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

  toPrevStep() {
    if (this.activeTabIndex > 0) {
      this.activeTabIndex -= 1;
      if (this.activeTabIndex === 0 && !this.dimensionMode) {
        this.canClickTab = false;
      }
    }
  }

  showDialogBox() {
    let isCompleted = false;
    this.currentOfferResult.ideate.forEach(item => {
      if (item.subMilestone == "Strategy Review" && item.status == "Completed") {
        isCompleted = true;
      }
    });

    if (isCompleted && this.isChangedAttribute) {
      this.showDialog = true;
    }
    else
      this.toNextStep();
  }


  toNextStep() {

    if (this.activeTabIndex === 0 && !this.dimensionMode) {
      this.canClickTab = true;
      var index = 0;
      var groupKeys = this.getGroupKeys(this.groupData[0]);
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
      let postData = this.offerData;
      postData['groups'] = this.offerData['groups'];


      this.monetizationModelService.toNextSetp(postData).subscribe(data => {
        this.proceedButtonStatusValid = true;
        let tempMessage: any = {};
        if (data['mmMapperStatus'] === 'Aligned') {
          tempMessage = { contentHead: data['mmMapperStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is fully aligned to ${data['mmModel']}`, mmModel: data['mmModel'] };
        } else if (data['mmMapperStatus'] === 'Partially Aligned') {
          tempMessage = { contentHead: data['mmMapperStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is partially aligned to ${data['mmModel']}.`, mmModel: data['mmModel'] };
        } else {
          tempMessage = { contentHead: data['mmMapperStatus'], content: '  Your selection of Offer Characteristics indicate that your Offer is Not Aligned to any of the 7 Monetization Models.' };
        }

        let isCompleted = false;
        this.currentOfferResult.ideate.forEach(item => {
          if (item.subMilestone == "Strategy Review" && item.status == "Completed") {
            isCompleted = true;
          }
        });

        if (isCompleted && this.isChangedAttribute && (tempMessage["contentHead"] != this.message["contentHead"] || tempMessage["content"] != this.message["content"])) {
          this.showDialog = true;
          return;
        }

        if (data['mmMapperStatus'] === 'Aligned') {
          this.message = { contentHead: data['mmMapperStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is fully aligned to ${data['mmModel']}`, mmModel: data['mmModel'] };
        } else if (data['mmMapperStatus'] === 'Partially Aligned') {
          this.message = { contentHead: data['mmMapperStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is partially aligned to ${data['mmModel']}.`, mmModel: data['mmModel'] };
        } else {
          this.message = { contentHead: data['mmMapperStatus'], content: '  Your selection of Offer Characteristics indicate that your Offer is Not Aligned to any of the 7 Monetization Models.' };
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
        this.proceedToStakeholder(false);
      });
    } else {
      if (this.activeTabIndex < this.groupNames.length - 1) {
        this.activeTabIndex += 1;
      }
    }

    this.emitEventToChild();
    this.proceedToStakeholder(false);
  }

  getStakeData(mmModel) {

    // Initialize Right Panel Component Data
    this.derivedMM = mmModel;
    this.offerId = this.currentOfferId;
    this.primaryBE = this.offerBuilderdata['primaryBEList'][0];
    this.rightPanelService.displayAverageWeeks(this.primaryBE, this.derivedMM).subscribe(
      (leadTime) => {
        this.noOfWeeksDifference = Number(leadTime['averageOverall']).toFixed(1);
        this.displayLeadTime = true;
      },
      () => {
        this.noOfWeeksDifference = 'N/A';
      }
    );

    this.monetizationModelService.showDefaultStakeHolders(mmModel, this.offerBuilderdata['primaryBEList'][0]).subscribe(res => {

      let keyUsers;
      this.stakeData = {};

      if (res != null) {
        keyUsers = res;
      }

      // Build data for owner
      if (this.stakeData['Owner'] == null) {
        this.stakeData['Owner'] = [];
      }


      // Populate Default Stake Holders - Owner
      this.accessMgmtService.checkAdminAccess().toPromise().then((resUserInfo) => {

        this.stakeData['Owner'].push(
          {
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
          });
      });

      // Populate Default Stake Holders - Other Functional Users
      keyUsers.forEach(user => {

        const curUser = user;
        curUser['stakeholderDefaults'] = true;

        if (this.stakeData[user['userMappings'][0]['functionalRole']] == null) {
          this.stakeData[user['userMappings'][0]['functionalRole']] = [];
        }
        this.stakeData[user['userMappings'][0]['functionalRole']].push(curUser);

      });

      // Remove Similar Stakeholders From Updated Stake Holder List

      // Retrieve Functional Names
      for (const ownerName of Object.keys(this.stakeData)) {

        // Retrieve Owner Details Realted To Functiona Names 
        for (let i = 0; i < this.stakeData[ownerName].length; i++) {

          // Retrieve ith Functional Person
          const ownerDetails = this.stakeData[ownerName][i];

          // Remove If Stakeholder Is Present In Default List
          if (this.stakeData[ownerName] == null) {
            continue;
          } else if (this.stakeData[ownerName][i]['_id'] === (ownerDetails['_id'])) {
            const index = this.stakeData[ownerName].findIndex(() => this.stakeData[ownerName][i]['_id'] === (ownerDetails['_id']));
            if (this.updatedStakeHolderInfo[ownerName] != null) {
              this.updatedStakeHolderInfo[ownerName].splice(index, 1);
            }
          }

        }
      }

      // Add Stakeholders to Stake Data That Is Missing From Stake Holder List

      // Retrieve Functional Names
      for (const ownerName of Object.keys(this.updatedStakeHolderInfo)) {

        // Retrieve Owner Details Realted To Functiona Names 
        for (let i = 0; i < this.updatedStakeHolderInfo[ownerName].length; i++) {

          // Retrieve ith Functional Person
          const ownerDetails = this.updatedStakeHolderInfo[ownerName][i];

          // Add If Stakeholder Is Missing In Default List - Parent Level
          if (this.stakeData[ownerName] == null) {
            this.stakeData[ownerName] = [
              {
                userName: ownerDetails['userName'],
                emailId: ownerDetails['_id'] + '@cisco.com',
                _id: ownerDetails['_id'],
                userMappings: [{
                  appRoleList: [],
                  businessEntity: ownerDetails['userMappings'][0]['businessEntity'],
                  functionalRole: ownerDetails['userMappings'][0]['functionalRole'],
                  offerRole: ownerDetails['userMappings'][0]['functionalRole']
                }
                ],
                stakeholderDefaults: true
              }];
          } else {
            // Add If Stakeholder Is Missing In Default List - Child Level
            this.stakeData[ownerName].push(
              {
                userName: ownerDetails['userName'],
                emailId: ownerDetails['_id'] + '@cisco.com',
                _id: ownerDetails['_id'],
                userMappings: [{
                  appRoleList: [],
                  businessEntity: ownerDetails['userMappings'][0]['businessEntity'],
                  functionalRole: ownerDetails['userMappings'][0]['functionalRole'],
                  offerRole: ownerDetails['userMappings'][0]['functionalRole']
                }
                ],
                stakeholderDefaults: true
              });
          }

        }
      }

    });






  }

  emitEventToChild() {
    this.eventsSubject.next(this.offerBuilderdata['offerOwner']);
  }

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

  proceedToStakeholder(withRouter = true) {

    let proceedToStakeholderPostData = {};
    proceedToStakeholderPostData['offerId'] = this.currentOfferId == null ? '' : this.currentOfferId;
    proceedToStakeholderPostData['offerName'] = this.offerBuilderdata['offerName'] == null ? '' : this.offerBuilderdata['offerName'];
    proceedToStakeholderPostData['offerDesc'] = this.offerBuilderdata['offerDesc'] == null ? '' : this.offerBuilderdata['offerDesc'];
    proceedToStakeholderPostData['offerCreatedBy'] = this.offerBuilderdata['offerCreatedBy'] == null ? '' : this.offerBuilderdata['offerCreatedBy'];
    proceedToStakeholderPostData['offerCreationDate'] = this.offerBuilderdata['offerCreationDate'] == null ? '' : this.offerBuilderdata['offerCreationDate'];
    proceedToStakeholderPostData['offerOwner'] = this.offerBuilderdata['offerOwner'] == null ? '' : this.offerBuilderdata['offerOwner'];
    proceedToStakeholderPostData['clonedOfferId'] = this.offerBuilderdata['clonedOfferId'] == null ? '' : this.offerBuilderdata['clonedOfferId'];
    proceedToStakeholderPostData['primaryBUList'] = this.offerBuilderdata['primaryBUList'] == null ? '' : this.offerBuilderdata['primaryBUList'];
    proceedToStakeholderPostData['primaryBEList'] = this.offerBuilderdata['primaryBEList'] == null ? '' : this.offerBuilderdata['primaryBEList'];
    proceedToStakeholderPostData['strategyReviewDate'] = this.offerBuilderdata['strategyReviewDate'] == null ? '' : this.offerBuilderdata['strategyReviewDate'];
    proceedToStakeholderPostData['designReviewDate'] = this.offerBuilderdata['designReviewDate'] == null ? '' : this.offerBuilderdata['designReviewDate'];
    proceedToStakeholderPostData['readinessReviewDate'] = this.offerBuilderdata['readinessReviewDate'] == null ? '' : this.offerBuilderdata['readinessReviewDate'];

    let selectedCharacteristics = [];
    let additionalCharacteristics = [];

    this.groupData.forEach((group, index) => {

      for (const prop of Object.keys(group)) {

        const subselectedCharacteristics = {};
        const notSubselectedCharacteristics = {};
        subselectedCharacteristics['group'] = this.groupNames[index];
        subselectedCharacteristics['subgroup'] = prop;
        subselectedCharacteristics['alignmentStatus'] = this.message['contentHead'];
        subselectedCharacteristics['characteristics'] = [];

        notSubselectedCharacteristics['group'] = this.groupNames[index];
        notSubselectedCharacteristics['subgroup'] = prop;
        notSubselectedCharacteristics['alignmentStatus'] = this.message['contentHead'];
        notSubselectedCharacteristics['characteristics'] = [];
        group[prop].forEach((characters) => {
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
    proceedToStakeholderPostData['selectedCharacteristics'] = selectedCharacteristics;
    proceedToStakeholderPostData['additionalCharacteristics'] = additionalCharacteristics;
    proceedToStakeholderPostData['derivedMM'] = this.currentMMModel == null ? '' : this.currentMMModel;
    proceedToStakeholderPostData['overallStatus'] = this.message['contentHead'];

    const stakeHolders = [];
    for (const prop of Object.keys(this.stakeData)) {
      this.stakeData[prop].forEach(sh => {

        stakeHolders.push({
          '_id': sh['_id'],
          'businessEntity': sh['userMappings'][0]['businessEntity'],
          'functionalRole': sh['userMappings'][0]['functionalRole'],
          'offerRole': sh['userMappings'][0]['functionalRole'] === 'BUPM' && sh['_id'] === this.offerBuilderdata['offerOwner'] ? 'Owner' : sh['userMappings'][0]['functionalRole'],
          'stakeholderDefaults': sh['stakeholderDefaults'],
          'name': sh['userName']
        });

      });
    }

    proceedToStakeholderPostData['stakeholders'] = stakeHolders;
    proceedToStakeholderPostData['expectedLaunchDate'] = this.offerBuilderdata['expectedLaunchDate'];
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
    proceedToStakeholderPostData['secondaryBUList'] = this.offerBuilderdata['secondaryBUList'];
    proceedToStakeholderPostData['secondaryBEList'] = this.offerBuilderdata['secondaryBEList'];


    let that = this;
    this.monetizationModelService.proceedToStakeholder(proceedToStakeholderPostData).subscribe(() => {
      let proceedPayload = {
        'taskId': '',
        'userId': this.offerBuilderdata['offerOwner'],
        'caseId': that.caseId,
        'offerId': that.currentOfferId,
        'taskName': 'Offer MM',
        'action': '',
        'comment': ''
      };
      that.offerPhaseService.proceedToStakeHolders(proceedPayload).subscribe(() => {
        if (withRouter === true) {
          that.router.navigate(['/stakeholderFull', that.currentOfferId, that.caseId]);
        }
      });
    });

  }

  proceedToOfferSolution(withRouter = true) {


    let groups = [];
    let groupDataWithFirst = [];
    groupDataWithFirst.push(this.dimensionFirstGroupData);
    groupDataWithFirst = groupDataWithFirst.concat(this.groupData);
    let groupNamesWithFirst = [];
    groupNamesWithFirst.push(this.dimensionFirstGroupName);

    groupNamesWithFirst = groupNamesWithFirst.concat(this.groupNames);

    groupDataWithFirst.forEach((group, index) => {
      let curGroup = {};
      curGroup['groupName'] = groupNamesWithFirst[index];
      curGroup['subGroup'] = [];
      for (const prop of Object.keys(group)) {
        let curSubGroup = {};
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

    let postOfferSolutioningData = {};
    postOfferSolutioningData['groups'] = groups;
    postOfferSolutioningData['functionalRole'] = this.configService.startupData.functionalRole;
    postOfferSolutioningData['mmModel'] = this.currentMMModel == null ? '' : this.currentMMModel;
    postOfferSolutioningData['offerId'] = this.currentOfferId == null ? '' : this.currentOfferId;
    postOfferSolutioningData['mmMapperStatus'] = this.message['contentHead'];
    console.log('postForOfferSolutioning Data:', postOfferSolutioningData);

    this.offersolutioningService.postForOfferSolutioning(postOfferSolutioningData).subscribe(result => {

      let postRuleResultData = result;
      postRuleResultData['offerId'] = this.currentOfferId;
      this.monetizationModelService.postRuleResult(postRuleResultData).subscribe(() => { });

      let proceedToStakeholderPostData = {};
      proceedToStakeholderPostData['offerId'] = this.currentOfferId == null ? '' : this.currentOfferId;
      proceedToStakeholderPostData['offerName'] = this.offerBuilderdata['offerName'] == null ? '' : this.offerBuilderdata['offerName'];
      proceedToStakeholderPostData['offerDesc'] = this.offerBuilderdata['offerDesc'] == null ? '' : this.offerBuilderdata['offerDesc'];
      proceedToStakeholderPostData['offerCreatedBy'] = this.offerBuilderdata['offerCreatedBy'] == null ? '' : this.offerBuilderdata['offerCreatedBy'];
      proceedToStakeholderPostData['offerCreationDate'] = this.offerBuilderdata['offerCreationDate'] == null ? '' : this.offerBuilderdata['offerCreationDate'];
      proceedToStakeholderPostData['offerOwner'] = this.offerBuilderdata['offerOwner'] == null ? '' : this.offerBuilderdata['offerOwner'];
      proceedToStakeholderPostData['clonedOfferId'] = this.offerBuilderdata['clonedOfferId'] == null ? '' : this.offerBuilderdata['clonedOfferId'];
      proceedToStakeholderPostData['primaryBUList'] = this.offerBuilderdata['primaryBUList'] == null ? '' : this.offerBuilderdata['primaryBUList'];
      proceedToStakeholderPostData['primaryBEList'] = this.offerBuilderdata['primaryBEList'] == null ? '' : this.offerBuilderdata['primaryBEList'];
      proceedToStakeholderPostData['strategyReviewDate'] = this.offerBuilderdata['strategyReviewDate'] == null ? '' : this.offerBuilderdata['strategyReviewDate'];
      proceedToStakeholderPostData['designReviewDate'] = this.offerBuilderdata['designReviewDate'] == null ? '' : this.offerBuilderdata['designReviewDate'];
      proceedToStakeholderPostData['readinessReviewDate'] = this.offerBuilderdata['readinessReviewDate'] == null ? '' : this.offerBuilderdata['readinessReviewDate'];

      let selectedCharacteristics = [];
      let additionalCharacteristics = [];

      groupDataWithFirst.forEach((group, index) => {

        for (const prop of Object.keys(group)) {

          let subselectedCharacteristics = {};
          let notSubselectedCharacteristics = {};
          subselectedCharacteristics['group'] = groupNamesWithFirst[index];
          subselectedCharacteristics['subgroup'] = prop;
          subselectedCharacteristics['alignmentStatus'] = this.message['contentHead'];
          subselectedCharacteristics['characteristics'] = [];

          notSubselectedCharacteristics['group'] = groupNamesWithFirst[index];
          notSubselectedCharacteristics['subgroup'] = prop;
          notSubselectedCharacteristics['alignmentStatus'] = this.message['contentHead'];
          notSubselectedCharacteristics['characteristics'] = [];
          group[prop].forEach((characters) => {
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

      proceedToStakeholderPostData['selectedCharacteristics'] = selectedCharacteristics;
      proceedToStakeholderPostData['additionalCharacteristics'] = additionalCharacteristics;
      proceedToStakeholderPostData['derivedMM'] = this.currentMMModel == null ? '' : this.currentMMModel;
      proceedToStakeholderPostData['overallStatus'] = this.message['contentHead'];

      const stakeHolders = [];
      for (const prop of Object.keys(this.stakeData)) {
        this.stakeData[prop].forEach(sh => {
          stakeHolders.push({
            '_id': sh['_id'],
            'businessEntity': sh['userMappings'][0]['businessEntity'],
            'functionalRole': sh['userMappings'][0]['functionalRole'],
            'offerRole': sh['userMappings'][0]['functionalRole'] === 'BUPM' && sh['_id'] === this.offerBuilderdata['offerOwner'] ? 'Owner' : sh['userMappings'][0]['functionalRole'],
            'stakeholderDefaults': sh['stakeholderDefaults'],
            'name': sh['userName']
          });
        });
      }

      proceedToStakeholderPostData['stakeholders'] = stakeHolders;
      proceedToStakeholderPostData['expectedLaunchDate'] = this.offerBuilderdata['expectedLaunchDate'];
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
      proceedToStakeholderPostData['secondaryBUList'] = this.offerBuilderdata['secondaryBUList'];
      proceedToStakeholderPostData['secondaryBEList'] = this.offerBuilderdata['secondaryBEList'];

      proceedToStakeholderPostData['solutioningDetails'] = [];
      result['groups'].forEach(group => {
        group['subGroup'].forEach(subGroup => {
          let solutioningDetail = {
            'dimensionGroup': group['groupName'],
            'dimensionSubgroup': subGroup['subGroupName'],
            'dimensionAttribute': subGroup['selected'],
            'primaryFunctions': [],
            'secondaryFunctions': [],
            'Details': []
          };
          if (subGroup['listGrpQuestions'] != null && subGroup['listGrpQuestions'].length > 0) {
            solutioningDetail['primaryFunctions'] = subGroup['listGrpQuestions'][0]['primaryPOC'];
            solutioningDetail['secondaryFunctions'] = subGroup['listGrpQuestions'][0]['secondaryPOC'];
            subGroup['listGrpQuestions'].forEach(question => {
              let detail = {
                'solutioninQuestion': question['question'],
                'egenieAttributeName': question['egineAttribue'],
                'oSGroup': question['osGroup']
              };
              solutioningDetail['Details'].push(detail);
            });
          }
          proceedToStakeholderPostData['solutioningDetails'].push(solutioningDetail);
        });
      });
      this.monetizationModelService.proceedToStakeholder(proceedToStakeholderPostData).subscribe(() => {

        let dimensionProceedPayload = {
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
          if (withRouter === true) {
            this.router.navigate(['/offerSolutioning', this.currentOfferId, this.caseId]);
          }
        })
      });

    })
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
}