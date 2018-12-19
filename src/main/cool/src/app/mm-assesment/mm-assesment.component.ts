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
  bviewDeckData: any[];
  choiceSelected;
  offerCharacteristicsGroup = {};
  offerDimensionsGroup={};
  salesDimensionsGroup={};
  pricingDimensionsGroup={};
  deliveryDimensionsGroup={};
  financialDimensionsGroup={};
  groupNames=[];
  tabIndex: number =0;
  groupKeys = [];
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
    });

  }



  ngOnInit() {

    this.message = { contentHead: "Great Work!", content: " Select the idea offer characteristics below to determine the Monitization Model best aligns to your requirements.", color: "black" };


    this.MonetizationModelService.getAttributes().subscribe(data => {
      this.offerData = data;
     // Offer Characteristics
      let defaultOfferCharacteristicsGroup = this.offerData['groups'][0];
      this.groupNames.push(defaultOfferCharacteristicsGroup['groupName']);
      defaultOfferCharacteristicsGroup['subGroup'].forEach(g => {
        this.offerCharacteristicsGroup[g['subGroupName']] = [];
        g.choices.forEach((c) => {
          this.offerCharacteristicsGroup[g['subGroupName']].push({ name: c, type: 0, status: -1 });
        })
      });
     // Offer Dimensions
      let defaultOfferDimensionsGroup=this.offerData['groups'][1];
      this.groupNames.push(defaultOfferDimensionsGroup['groupName']);
      defaultOfferDimensionsGroup['subGroup'].forEach(g => {
        this.offerDimensionsGroup[g['subGroupName']] = [];
        g.choices.forEach((c) => {
          this.offerDimensionsGroup[g['subGroupName']].push({ name: c, type: 0, status: -1 });
        })
      })

      // Sales Dimensions

      let defaultSalesDimensionsGroup=this.offerData['groups'][2];
      this.groupNames.push(defaultSalesDimensionsGroup['groupName']);
      defaultSalesDimensionsGroup['subGroup'].forEach(g => {
        this.salesDimensionsGroup[g['subGroupName']] = [];
        g.choices.forEach((c) => {
          this.salesDimensionsGroup[g['subGroupName']].push({ name: c, type: 0, status: -1 });
        })
      })
      //Pricing Dimensions
      let defaultPricingDimensionsGroup=this.offerData['groups'][3];
      this.groupNames.push(defaultPricingDimensionsGroup['groupName']);
      defaultPricingDimensionsGroup['subGroup'].forEach(g => {
        this.pricingDimensionsGroup[g['subGroupName']] = [];
        g.choices.forEach((c) => {
          this.pricingDimensionsGroup[g['subGroupName']].push({ name: c, type: 0, status: -1 });
        })
      })
      //Delivery Dimensions
      let defaultDeliveryDimensionsGroup=this.offerData['groups'][4];
      this.groupNames.push(defaultDeliveryDimensionsGroup['groupName']);
      defaultDeliveryDimensionsGroup['subGroup'].forEach(g => {
        this.deliveryDimensionsGroup[g['subGroupName']] = [];
        g.choices.forEach((c) => {
          this.deliveryDimensionsGroup[g['subGroupName']].push({ name: c, type: 0, status: -1 });
        })
      })

      // Financial Dimensions
      let defaultFinancialDimensionsGroup=this.offerData['groups'][5];
      this.groupNames.push(defaultFinancialDimensionsGroup['groupName']);

      defaultFinancialDimensionsGroup['subGroup'].forEach(g => {
        this.financialDimensionsGroup[g['subGroupName']] = [];
        g.choices.forEach((c) => {
          this.financialDimensionsGroup[g['subGroupName']].push({ name: c, type: 0, status: -1 });
        })
      })

      this.groupKeys = Object.keys(this.offerCharacteristicsGroup);

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


  // Attributes Selection Rules

  getSubgroupAttributes(groupName) {
  
    let offerComponentAttrs = this.offerCharacteristicsGroup[groupName];
    let res = [];
    offerComponentAttrs.forEach(function (attr) {
      if (attr.status == 1) {
        res.push(attr.name);
      }
    });
    return res;
  }

  clearSubGroupType() {
    this.offerCharacteristicsGroup['Hosting Party'].forEach((attr) => {
      attr.type = 0;
    });
    this.offerCharacteristicsGroup['Deployment'].forEach((attr) => {
      attr.type = 0;
    });
    this.offerCharacteristicsGroup['Delivery'].forEach((attr) => {
      attr.type = 0;
    });
    this.offerCharacteristicsGroup["Licensing"].forEach((attr) => {
      attr.type = 0;
    });
  }

  changeSubGroupType() {
    let selectedAttrs = this.getSubgroupAttributes('Offer Components');
    this.clearSubGroupType();
    if (selectedAttrs.length == 1 && selectedAttrs.indexOf("SW - SaaS") != -1) {
      var perpetual = this.offerCharacteristicsGroup['Licensing'].find(obj => {
        return obj.name === 'Perpetual'
      });
      perpetual.type = 1;

      this.offerCharacteristicsGroup['Delivery'].forEach((attr) => {
        if (attr.name == 'Provisioning Fulfillment') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      this.offerCharacteristicsGroup['Deployment'].forEach((attr) => {
        if (attr.name == 'Cloud') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });
    } else if (selectedAttrs.includes("SW - SaaS") && (selectedAttrs.includes("Hardware (Commodity (x86) / Proprietary)") || selectedAttrs.includes("SW - OS") || selectedAttrs.includes("SW - OS Feature / Application / 3rd Part SW / VNF"))) {
      this.offerCharacteristicsGroup['Delivery'].forEach((attr) => {
        if (attr.name == 'Provisioning Fulfillment') {
          attr.type = 2;
        }
      });

      this.offerCharacteristicsGroup['Deployment'].forEach((attr) => {
        if (attr.name == 'Hybrid') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else if (selectedAttrs.includes("Hardware (Commodity (x86) / Proprietary)") && (selectedAttrs.includes("SW - OS") || selectedAttrs.includes("SW - OS Feature / Application / 3rd Part SW / VNF"))) {
      this.offerCharacteristicsGroup['Hosting Party'].forEach((attr) => {
        if (attr.name == "Hosting Party - N/A") {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      this.offerCharacteristicsGroup['Delivery'].forEach((attr) => {
        if (attr.name == 'Provisioning Fulfillment') {
          attr.type = 1;
        }
      });

      this.offerCharacteristicsGroup['Deployment'].forEach((attr) => {
        if (attr.name == 'On-Premise') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else if (selectedAttrs.length == 1 && selectedAttrs.includes("Hardware (Commodity (x86) / Proprietary)")) {

      this.offerCharacteristicsGroup['Hosting Party'].forEach((attr) => {
        if (attr.name == "Hosting Party - N/A") {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      this.offerCharacteristicsGroup['Delivery'].forEach((attr) => {
        if (attr.name == 'Physical Fulfillment') {
          attr.type = 2;
        }
      });

      this.offerCharacteristicsGroup['Deployment'].forEach((attr) => {
        if (attr.name == 'On-Premise') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else if (selectedAttrs.includes("SW - OS") || selectedAttrs.includes("SW - OS Feature / Application / 3rd Part SW / VNF")) {

      this.offerCharacteristicsGroup['Hosting Party'].forEach((attr) => {
        if (attr.name == "Hosting Party - N/A") {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });
      
      this.offerCharacteristicsGroup['Deployment'].forEach((attr) => {
        if (attr.name == 'On-Premise') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else {
      this.clearSubGroupType();
    }

  }

  toggleSelected(attribute) {
    // debugger;
    if (attribute.type == 2 && attribute.status == -1) {
      attribute.type = 0;
      return;
    }

    attribute.status = -attribute.status;
    if (this.offerCharacteristicsGroup['Offer Components'].includes(attribute)) {
      this.changeSubGroupType();
    }

    var next = 0;
    this.groupKeys.forEach(key => {
      for (let attr of this.offerCharacteristicsGroup[key]) {
        if (attr.status===1||attr.type===2) {
          next += 1;
          break;
        }
      }
    })
    if (next == this.groupKeys.length) {
      this.canClickNextStep = true;
    } else {
      this.canClickNextStep = false;
    }

  }


  toNextStep() {
    // let processedgroups = {};
    var index = 0;
    this.groupKeys.forEach((key) => {
      // processedgroups[key] = [];
      this.offerData['groups'][0]['subGroup'][index]['selected'] = [];
      this.offerCharacteristicsGroup[key].forEach((attr) => {
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

