import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SharedServiceService } from '../shared-service.service';
import { Subscription } from 'rxjs/Subscription';
import { CreateOfferService } from '../services/create-offer.service';
import { MonetizationModelService } from '../services/monetization-model.service';
import { post } from 'selenium-webdriver/http';





@Component({
  selector: 'app-mm-assesment',
  templateUrl: './mm-assesment.component.html',
  styleUrls: ['./mm-assesment.component.css']
})
export class MmAssesmentComponent implements OnInit {


  public model: any;
  aligned: boolean;
  proceedFlag: boolean = false;
  alignedFlag: boolean = false;
  subscription: Subscription;
  offerData: any;
  currentOfferId;
  caseId;
  bviewDeckData: any[];
  choiceSelected;
  groupData = [];
  groupNames=[];
  activeTabIndex: number = 0;
  message = {};
  stakeData = {};
  offerBuilderdata = {};
  canClickNextStep: boolean = false;
  currentMMModel:any;
  currentPrimaryBE:any;

  constructor(private router: Router,
    private sharedService: SharedServiceService,
    private createOfferService: CreateOfferService,
    private activatedRoute: ActivatedRoute,
    private MonetizationModelService: MonetizationModelService
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


    this.message = { contentHead: "Great Work!", content: " Select the idea offer characteristics below to determine the Monitization Model best aligns to your requirements.", color: "black" };


    this.MonetizationModelService.getAttributes().subscribe(data => {
      this.offerData = data;

      this.offerData['groups'].forEach(group => {
        this.groupNames.push(group['groupName']);
        let curGroup = {};
        group['subGroup'].forEach(g => {
          curGroup[g['subGroupName']] = [];
          g.choices.forEach((c) => {
            curGroup[g['subGroupName']].push({ name: c, type: 0, status: -1 });
          })
        })
        this.groupData.push(curGroup);
      })

    });

    this.MonetizationModelService.getOfferBuilderData(this.currentOfferId).subscribe(data => {
      this.offerBuilderdata = data;
     
      this.offerBuilderdata['BEList'] = [];
      this.offerBuilderdata['BUList'] = [];
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
    })

  }


  //Go to Next Page
  fullStakeHolder() {
    debugger;
    this.router.navigate(['/stakeholderFull', this.currentOfferId]);
  }


  // Attributes Selection Rules

  getSubgroupAttributes(curGroup, groupName) {
    let offerComponentAttrs = curGroup[groupName];
    let res = [];
    offerComponentAttrs.forEach(function (attr) {
      if (attr.status == 1) {
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
    curGroup["Licensing"].forEach((attr) => {
      attr.type = 0;
    });
  }

  changeSubGroupType(curGroup) {
    let selectedAttrs = this.getSubgroupAttributes(curGroup, 'Offer Components');
    this.clearSubGroupType(curGroup);
    if (selectedAttrs.length == 1 && selectedAttrs.indexOf("SW - SaaS") != -1) {
      var perpetual = curGroup['Licensing'].find(obj => {
        return obj.name === 'Perpetual'
      });
      perpetual.type = 1;

      curGroup['Delivery'].forEach((attr) => {
        if (attr.name == 'Provisioning Fulfillment') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      curGroup['Deployment'].forEach((attr) => {
        if (attr.name == 'Cloud') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });
    } else if (selectedAttrs.includes("SW - SaaS") && (selectedAttrs.includes("Hardware (Commodity (x86) / Proprietary)") || selectedAttrs.includes("SW - OS") || selectedAttrs.includes("SW - OS Feature / Application / 3rd Part SW / VNF"))) {
      curGroup['Delivery'].forEach((attr) => {
        if (attr.name == 'Provisioning Fulfillment') {
          attr.type = 2;
        }
      });

      curGroup['Deployment'].forEach((attr) => {
        if (attr.name == 'Hybrid') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else if (selectedAttrs.includes("Hardware (Commodity (x86) / Proprietary)") && (selectedAttrs.includes("SW - OS") || selectedAttrs.includes("SW - OS Feature / Application / 3rd Part SW / VNF"))) {
      curGroup['Hosting Party'].forEach((attr) => {
        if (attr.name == "Hosting Party - N/A") {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      curGroup['Delivery'].forEach((attr) => {
        if (attr.name == 'Provisioning Fulfillment') {
          attr.type = 1;
        }
      });

      curGroup['Deployment'].forEach((attr) => {
        if (attr.name == 'On-Premise') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else if (selectedAttrs.length == 1 && selectedAttrs.includes("Hardware (Commodity (x86) / Proprietary)")) {

      curGroup['Hosting Party'].forEach((attr) => {
        if (attr.name == "Hosting Party - N/A") {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      curGroup['Delivery'].forEach((attr) => {
        if (attr.name == 'Physical Fulfillment') {
          attr.type = 2;
        }
      });

      curGroup['Deployment'].forEach((attr) => {
        if (attr.name == 'On-Premise') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else if (selectedAttrs.includes("SW - OS") || selectedAttrs.includes("SW - OS Feature / Application / 3rd Part SW / VNF")) {

      curGroup['Hosting Party'].forEach((attr) => {
        if (attr.name == "Hosting Party - N/A") {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });
      
      curGroup['Deployment'].forEach((attr) => {
        if (attr.name == 'On-Premise') {
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
    if (attribute.type == 2 && attribute.status == -1) {
      attribute.type = 0;
      return;
    }
    attribute.status = -attribute.status;

    if (this.activeTabIndex == 0) {
      if (this.groupData[0]['Offer Components'].includes(attribute)) {
        this.changeSubGroupType(this.groupData[0]);
      }
  
      var next = 0;
      var groupKeys = this.getGroupKeys(this.groupData[this.activeTabIndex]);
      groupKeys.forEach(key => {
        for (let attr of this.groupData[0][key]) {
          if (attr.status===1||attr.type===2) {
            next += 1;
            break;
          }
        }
      })
      if (next == groupKeys.length) {
        this.canClickNextStep = true;
      } else {
        this.canClickNextStep = false;
      }
    }
  }

  fakeNextStep() {
    if (this.activeTabIndex < this.groupNames.length - 1) {
      this.activeTabIndex += 1;
    }
  }

  toPrevStep() {
    if (this.activeTabIndex > 0) {
      this.activeTabIndex -= 1;
    }
  }

  toNextStep() {
    // let processedgroups = {};
    if (this.activeTabIndex == 0) {
      var index = 0;
      var groupKeys = this.getGroupKeys(this.groupData[0]);
      groupKeys.forEach((key) => {
        // processedgroups[key] = [];
        this.offerData['groups'][0]['subGroup'][index]['selected'] = [];
        this.groupData[0][key].forEach((attr) => {
          if (attr.status == 1 || attr.type == 2) {
            this.offerData['groups'][0]['subGroup'][index]['selected'].push(attr.name);
            // processedgroups[key].push(attr.name);
          }
        })
        index += 1;
      })
      this.offerData["offerId"] = this.currentOfferId;
      this.offerData["mmChoice"] = "REVALIDATE";
      this.offerData["mmId"] = null;
      // console.log(this.offerData);
      var postData = this.offerData;
      postData['groups'] = this.offerData['groups'].slice(0, 1);
      console.log(postData);
  
  
      this.MonetizationModelService.toNextSetp(JSON.stringify(postData)).subscribe(data => {
        console.log(data);
        if (data['mmMapperStatus'] === 'Aligned') {
          this.message = { contentHead: data['mmMapperStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is fully aligned to ${data['mmModel']}`,mmModel: data['mmModel'] };
        } else if (data['mmMapperStatus'] === 'Partially Aligned') {
          this.message = { contentHead: data['mmMapperStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is partially aligned to ${data['mmModel']}.`, mmModel: data['mmModel'] };
        } else {
          this.message = { contentHead: data['mmMapperStatus'], content: "  Your selection of Offer Characteristics indicate that your Offer is Not Aligned to any of the 7 Monetization Models." };
        }
  
        this.currentMMModel = data['mmModel'];
        if (data['mmModel'] != null && this.activeTabIndex < this.groupNames.length - 1) {
          this.activeTabIndex += 1;
        }
        this.currentPrimaryBE = this.offerBuilderdata['primaryBEList'][0];
        this.MonetizationModelService.showStakeholders(data['mmModel'], this.offerBuilderdata['primaryBEList'][0]).subscribe(res => {
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
        })
      })
    } else {
      if (this.activeTabIndex < this.groupNames.length - 1) {
        this.activeTabIndex += 1;
      }
    }
  }

  updateStakeData(data) {
    // debugger;
    this.MonetizationModelService.showStakeholders(this.currentMMModel, this.currentPrimaryBE).subscribe(res => {
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
    })
  }

  getGroupKeys(obj) {
    if (typeof obj === 'object') {
      return Object.keys(obj);
    } else {
      return [];
    }
  }
  changeTab(index) {
    if (this.canClickNextStep == true && this.currentMMModel != null) {
      this.activeTabIndex = index;
    }
  }

proceedToStakeholder(){
  let proceedToStakeholderPostData = {};
  proceedToStakeholderPostData['offerId'] = this.currentOfferId;
  proceedToStakeholderPostData['offerName'] = this.offerBuilderdata['offerName'];
  proceedToStakeholderPostData['offerDesc'] = this.offerBuilderdata['offerDesc'];
  proceedToStakeholderPostData['offerCreatedBy'] = this.offerBuilderdata['offerCreatedBy'];
  proceedToStakeholderPostData['offerCreationDate'] = this.offerBuilderdata['offerCreationDate'];
  proceedToStakeholderPostData['offerOwner'] = this.offerBuilderdata['offerOwner'];
  proceedToStakeholderPostData['clonedOfferId'] = this.offerBuilderdata['clonedOfferId'];
  proceedToStakeholderPostData['primaryBUList'] = this.offerBuilderdata['primaryBUList'];
  proceedToStakeholderPostData['primaryBEList'] = this.offerBuilderdata['primaryBEList'];

}




}

