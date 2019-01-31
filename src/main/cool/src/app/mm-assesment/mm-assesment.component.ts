import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SharedService } from '../shared-service.service';
import { Subscription ,  Subject } from 'rxjs';
import { CreateOfferService } from '../services/create-offer.service';
import { MonetizationModelService } from '../services/monetization-model.service';
import { OfferPhaseService } from '../services/offer-phase.service';
import { ConfigurationService } from '../services/configuration.service';
import { OfferDetailViewService } from '../services/offer-detail-view.service';
import { isDefaultChangeDetectionStrategy } from '@angular/core/src/change_detection/constants';
import {OffersolutioningService} from '../services/offersolutioning.service';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';

@Component({
  selector: 'app-mm-assesment',
  templateUrl: './mm-assesment.component.html',
  styleUrls: ['./mm-assesment.component.css']
})
export class MmAssesmentComponent implements OnInit {


  public model: any;
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
  stakeData = {};
  offerBuilderdata = {};
  canClickNextStep = false;
  currentMMModel: string = null;
  currentPrimaryBE: any;
  userName;
  eventsSubject: Subject<string> = new Subject<string>();
  ownerName;
  setFlag;
  backdropCustom;
  proceedButtonStatusValid = false;
  backbuttonStatusValid = true;
  offerArray:any[] = [] ;
  match =false;
  dimensionMode: Boolean = false;
  dimensionFirstGroupData: Object;
  dimensionFirstGroupName: string;

  constructor(private router: Router,
    private sharedService: SharedService,
    private createOfferService: CreateOfferService,
    private activatedRoute: ActivatedRoute,
    private monetizationModelService: MonetizationModelService,
    private offerPhaseService: OfferPhaseService,
    private offerDetailViewService: OfferDetailViewService,
    private configService: ConfigurationService,
    private offersolutioningService:OffersolutioningService,
  ) {
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
      console.log("selectedCharactersistics",selectedCharacteristics); 
    
      let that = this;

      // mm model and message section
      this.currentMMModel = offerDetailRes['derivedMM'];
      if (offerDetailRes['derivedMM'] != null && offerDetailRes['derivedMM'] !== '') {
        this.canClickNextStep = true;
      }
      if (offerDetailRes['overallStatus'] == null) {
        this.message = { contentHead: 'Great Work!', content: ' Select the idea offer characteristics below to determine the Monetization Model best aligns to your requirements.', color: 'black' };
      } else if (offerDetailRes['overallStatus'] === 'Aligned') {
        this.proceedButtonStatusValid = true;
        this.message = { contentHead: offerDetailRes['overallStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is fully aligned to ${offerDetailRes['derivedMM']}`, mmModel: offerDetailRes['derivedMM'] };
      } else if (offerDetailRes['overallStatus'] === 'Partially Aligned') {
        this.proceedButtonStatusValid = true;
        this.message = { contentHead: offerDetailRes['overallStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is partially aligned to ${offerDetailRes['derivedMM']}.`, mmModel: offerDetailRes['derivedMM'] };
      } else {
        this.proceedButtonStatusValid = true;
        this.message = { contentHead: offerDetailRes['overallStatus'], content: '  Your selection of Offer Characteristics indicate that your Offer is Not Aligned to any of the 7 Monetization Models.'};
      }

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

      this.monetizationModelService.getAttributes().subscribe(data => {
        that.offerData = data;
        console.log("selectedCharacteristics",selectedCharacteristics['Offer Characteristics']);
        that.offerData['groups'].forEach(group => {
          that.groupNames.push(group['groupName']);
          let curGroup = {};
          group['subGroup'].forEach(g => {
            // console.log("g:::",g.subGroupName)
            if(Object.keys(selectedCharacteristics).length != 0){
            this.offerArray = selectedCharacteristics['Offer Characteristics'][g['subGroupName']];
            }
            // console.log("offerArra::::",this.offerArray);
            curGroup[g['subGroupName']] = [];
            g.choices.forEach((c) => {
               this.match =false;
              const splitArr = c.split('#');
              const attrName = splitArr[0];
              const description = splitArr[1];
              // console.log("attrName:::::",attrName)

              if(this.offerArray && this.offerArray.length == 1 && this.offerArray ==attrName ){

                curGroup[g['subGroupName']].push({ name: attrName, type: 0, status: 1, tooltip: description });
               this.match =true;
          }



              if(this.offerArray && this.offerArray.length > 1){
                 this.offerArray.forEach(value =>{
                     if(attrName == value ){

                  curGroup[g['subGroupName']].push({ name: attrName, type: 0, status: 1, tooltip: description });
                  this.match = true;

                 }
                 if(this.match  == true){
                  return false;
                 }
               });
              }

              if(this.match == false){
                curGroup[g['subGroupName']].push({ name: attrName, type: 0, status: -1, tooltip: description });
              }

               
             /*  if (selectedCharacteristics[group['groupName']] != null &&
               selectedCharacteristics[group['groupName']][g['subGroupName']] != null &&
                 selectedCharacteristics[group['groupName']][g['subGroupName']].includes(c)){
              
                
                
                curGroup[g['subGroupName']].push({ name: attrName, type: 0, status: 1, tooltip: description });
                 
              } else {
                curGroup[g['subGroupName']].push({ name: attrName, type: 0, status: -1, tooltip: description });
              } */
            });
          });
          that.groupData.push(curGroup);
        });
        if(this.selectedGroupData.length >0){
          alert("no final Group data");
        }
        if (this.dimensionMode === true) {
          // dimension page, remove the first tab
          that.dimensionFirstGroupData = that.groupData[0];
          that.dimensionFirstGroupName = that.groupNames[0];
          that.groupData.shift();
          that.groupNames.shift();
        }
        console.log("offerData",that.groupData);
      });
    });
  }


  //downloadPDF
  downloadPDF(){
    this.monetizationModelService.getPDF(this.currentOfferId).subscribe(data =>{
    const nameOfFileToDownload = 'offer-details';
    console.log("nameoffile",nameOfFileToDownload);
      console.log(data);
        const blob = new Blob([data], {type: 'application/pdf'});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, nameOfFileToDownload);
         } else {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = nameOfFileToDownload;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

    }
  });

  }



  // Attributes Selection Rules

  getSubgroupAttributes(curGroup, groupName) {
    let offerComponentAttrs = curGroup[groupName];
    let res = [];
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
    }
  }

  toNextStep() {
    if (this.activeTabIndex === 0) {
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
      // console.log(this.offerData);
      let postData = this.offerData;
      postData['groups'] = this.offerData['groups'].slice(0, 1);


      this.monetizationModelService.toNextSetp(postData).subscribe(data => {
        this.proceedButtonStatusValid = true;
        if (data['mmMapperStatus'] === 'Aligned') {
          this.message = { contentHead: data['mmMapperStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is fully aligned to ${data['mmModel']}`, mmModel: data['mmModel'] };
        } else if (data['mmMapperStatus'] === 'Partially Aligned') {
          this.message = { contentHead: data['mmMapperStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is partially aligned to ${data['mmModel']}.`, mmModel: data['mmModel'] };
        } else {
          this.message = { contentHead: data['mmMapperStatus'], content: '  Your selection of Offer Characteristics indicate that your Offer is Not Aligned to any of the 7 Monetization Models.' };
        }

        this.currentMMModel = data['mmModel'];
        if (data['mmModel'] !== null && this.activeTabIndex < this.groupNames.length - 1) {
          this.activeTabIndex += 1;
        }
        this.currentPrimaryBE = this.offerBuilderdata['primaryBEList'][0];
        this.getStakeData(data['mmModel']);
      });
    } else {
      if (this.activeTabIndex < this.groupNames.length - 1) {
        this.activeTabIndex += 1;
      }
    }

    this.emitEventToChild();
  }

  getStakeData(mmModel) {
    this.monetizationModelService.showStakeholders(mmModel, this.offerBuilderdata['primaryBEList'][0]).subscribe(res => {
      this.stakeData = {};
      let keyUsers;
      if (res != null) {
        keyUsers = res;
      }

      // Build data for owner
      if (this.stakeData['Owner'] == null) {
        this.stakeData['Owner'] = [];
      }

      this.stakeData['Owner'].push(
        {
          userName: this.ownerName,
          emailId: this.offerBuilderdata['offerOwner'] + '@cisco.com',
          _id: this.offerBuilderdata['offerOwner'],
          userMappings: [{
            appRoleList: ['Owner'],
            businessEntity: 'Security',
            functionalRole: 'BUPM'
          }
          ],
          stakeholderDefaults: true
        });

      keyUsers.forEach(user => {
        if (this.stakeData[user['userMappings'][0]['appRoleList'][0]] == null) {
          this.stakeData[user['userMappings'][0]['appRoleList'][0]] = [];
        }
        let curUser = user;
        curUser['stakeholderDefaults'] = true;
        this.stakeData[user['userMappings'][0]['appRoleList'][0]].push(curUser);
      });


    });
  }

  emitEventToChild() {
    this.eventsSubject.next(this.offerBuilderdata['offerOwner']);
  }

  updateStakeData(data) {
    /* this.MonetizationModelService.showStakeholders(this.currentMMModel, this.currentPrimaryBE).subscribe(res => {
      this.stakeData = {};
      // console.log(res);
      let keyUsers = [];
      if (res != null && res[0] != null) {
        keyUsers = res[0]['coolRoleKeyUser'];
      }
      keyUsers.forEach(user => {
        if (this.stakeData[user['offerRole']] == null) {
          this.stakeData[user['offerRole']] = [];
        }
        this.stakeData[user['offerRole']].push({name: user['keyUser'], email: user['email']});
      })
    }) */
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
    if (this.canClickNextStep === true && this.currentMMModel !== null) {
      this.activeTabIndex = index;
    }
  }

  proceedToStakeholder() {
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
      for (let prop in group) {
        let subselectedCharacteristics = {};
        let notSubselectedCharacteristics = {};
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
        selectedCharacteristics.push(subselectedCharacteristics);
        additionalCharacteristics.push(notSubselectedCharacteristics);
      }
    });
    proceedToStakeholderPostData['selectedCharacteristics'] = selectedCharacteristics;
    proceedToStakeholderPostData['derivedMM'] = this.currentMMModel == null ? '' : this.currentMMModel;
    proceedToStakeholderPostData['overallStatus'] = this.message['contentHead'];
    let stakeHolders = [];
    for (let prop in this.stakeData) {
      this.stakeData[prop].forEach(sh => {
        stakeHolders.push({
          '_id': sh['_id'],
          'businessEntity': sh['userMappings'][0]['businessEntity'],
          'functionalRole': sh['userMappings'][0]['functionalRole'],
          'offerRole': sh['userMappings'][0]['appRoleList'][0],
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
    this.monetizationModelService.proceedToStakeholder(proceedToStakeholderPostData).subscribe(res => {
      let proceedPayload = {
        'taskId': '',
        'userId': this.offerBuilderdata['offerOwner'],
        'caseId': that.caseId,
        'offerId': that.currentOfferId,
        'taskName': 'Offer MM',
        'action': '',
        'comment': ''
      };
      that.offerPhaseService.proceedToStakeHolders(proceedPayload).subscribe(result => {
        that.router.navigate(['/stakeholderFull', that.currentOfferId, that.caseId]);
      });
    });

  }

  proceedToOfferSolution() {
    let postOfferSolutioningData = {};
    postOfferSolutioningData['offerId'] = this.currentOfferId == null ? '' : this.currentOfferId;

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
      for (let prop in group) {
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
    postOfferSolutioningData['groups'] = groups;
    postOfferSolutioningData['mmModel'] = this.currentMMModel == null ? '' : this.currentMMModel;
    postOfferSolutioningData['mmMapperStatus'] = this.message['contentHead'];
    console.log('postForOfferSolutioning Data:',postOfferSolutioningData);
 this.offersolutioningService.postForOfferSolutioning(postOfferSolutioningData).subscribe(result => {
   let notificationPayload = { };
   notificationPayload['type'] = 'Notification';

//      {
//     "offerId": "COOL_2102",
//     "caseId": "CASE-0000000528",
//     "actionTitle": "fdsaf",
//     "description": "dss",
//     "mileStone": "Offer Construct",
//     "selectedFunction": "BUPM",
//     "assignee": [
//         "jbondre","jagondal"                       << This is an Array of Ids of all assignees; 
//     ],
//     "dueDate": "2019-01-18T21:29:57.000Z",
//     "owner": "jagondal",      << Owner of the Offer
//     "offerName": "Jayraj Offer 1",
//     "type": "Notification"     << I don’t know about type for right now so just put Notification, for future functionality
// }


  let fakeGroup = { 'groups': [
    {
        "groupName": "Offer Characteristics",
        "subGroup": [
            {
                "subGroupName": "Offer Components",
                "choices": [
                    "Content",
                    "Managed Services",
                    "SW - OS",
                    "SW - SaaS"
                ],
                "selected": [
                    "Content",
                    "Cloud",
                    "Cisco"
                ],
                "failed": null,
                "subGroupStatus": "Aligned",
                "listGrpQuestions": [
                  {
                      "question": "Is this offer commissionable?",
                      "questionType": "Radioi Button",
                      "values": [
                          "Yes",
                          "No"
                      ],
                      "required": "Mandatory",
                      "primaryPOC": [
                          "BUPM",
                          "OLE"
                      ],
                      "secondaryPOC": [
                          "Finance",
                          "OLE"
                      ],
                      "osGroup":"SKU"
                      
                  },
                  {
                      "question": "Who are the target customers?",
                      "questionType": "Free Text",
                      "values": [
                          "SSP"
                      ],
                      "required": "Optional",
                      "primaryPOC": [
                          "BUPM",
                          "OLE"
                      ],
                      "secondaryPOC": [
                          "Finance",
                          "OLE"
                      ]
                  }
              ]
            },
            {
                "subGroupName": "Deployment",
                "choices": [
                    "Hybrid",
                    "On-Premise",
                    "Cloud"
                ],
                "selected": [  "Cloud"],
                "failed": null,
                "subGroupStatus": "Aligned",
                "listGrpQuestions": [
                  {
                      "question": "test question percent?",
                      "questionType": "Percentage Text",
                      "values": [
                      ],
                      "required": "Mandatory",
                      "primaryPOC": [
                          "BUPM",
                          "OLE"
                      ],
                      "secondaryPOC": [
                          "Finance",
                          "OLE"
                      ],
                      "osGroup":[
                        "FOE"
                      ]
                  },
                  {
                      "question": "test question Money?",
                      "questionType": "Currency Text",
                      "values": [
                          "SSP"
                      ],
                      "required": "Optional",
                      "primaryPOC": [
                          "BUPM",
                          "OLE"
                      ],
                      "secondaryPOC": [
                          "Finance",
                          "OLE"
                      ]
                  }
              ]
            },
            {
                "subGroupName": "Hosting Party",
                "choices": [
                    "Cisco",
                    "3rd Party",
                    "Hosting Party - N/A"
                ],
                "selected": ["Hosting Party - N/A"],
                "failed": null,
                "subGroupStatus": "Aligned"
            },
            {
                "subGroupName": "Delivery",
                "choices": [
                    "Electronic Fulfillment",
                    "Physical Fulfillment",
                    "Provisioning Fulfillment",
                    "Embedded Solution",
                    "Delivery - N/A"
                ],
                "selected": ["Delivery - N/A"],
                "failed": null,
                "subGroupStatus": "Aligned"
            },
            {
                "subGroupName": "Licensing",
                "choices": [
                    "Perpetual",
                    "Subscription: Pre-Commited Quantity",
                    "Subscription: Usage/ Utility"
                ],
                "selected": ["Subscription: Usage/ Utility"],
                "failed": null,
                "subGroupStatus": "Aligned",
                "listGrpQuestions": [
                  {
                      "question": "test question Dropdown?",
                      "questionType": "Dropdown",
                      "values": [
                          "op1",
                          "op2",
                          "op3"
                      ],
                      "required": "Mandatory",
                      "primaryPOC": [
                          "BUPM",
                          "OLE"
                      ],
                      "secondaryPOC": [
                          "Finance",
                          "OLE"
                      ],
                      "osGroup":[
                        "FINANCE"
                      ]
                  },
                  {
                      "question": "test question Multiple Choice?",
                      "questionType": "Multiple Choice",
                      "values": [
                          "SSP",
                          "SSP2",
                          "SSP3",
                      ],
                      "required": "Optional",
                      "primaryPOC": [
                          "BUPM",
                          "OLE"
                      ],
                      "secondaryPOC": [
                          "Finance",
                          "OLE"
                      ]
                  },
                  {
                    "question": "test question Date?",
                    "questionType": "Date",
                    "values": [
                        "SSP",
                        "SSP2",
                        "SSP3",
                    ],
                    "required": "Optional",
                    "primaryPOC": [
                        "BUPM",
                        "OLE"
                    ],
                    "secondaryPOC": [
                        "Finance",
                        "OLE"
                    ]
                }
              ]
            }
        ]
      
    }
]};
  this.offersolutioningService.saveSolutionData(this.currentOfferId, result);
  this.router.navigate(['/offerSolutioning', this.currentOfferId, this.caseId]);
 })

  }

  goBackToOffercreation() {
    this.router.navigate(['/coolOffer', this.currentOfferId, this.caseId]);
  }
}

