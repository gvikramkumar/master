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
  groups = {};
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

  onStrategyReview() {
    this.router.navigate(['/strategyReview', this.currentOfferId]);
  }

  ngOnInit() {

    this.message = { contentHead: "Great Work!", content: " Select the idea offer characteristics below to determine the Monitization Model best aligns to your requirements.", color: "black" };


    this.MonetizationModelService.getAttributes().subscribe(data => {
      this.offerData = data;
      let defaultOfferDataGroups = this.offerData['groups'][0];
      defaultOfferDataGroups['subGroup'].forEach((g) => {
        this.groups[g['subGroupName']] = [];
        g.choices.forEach((c) => {
          this.groups[g['subGroupName']].push({ name: c, type: 0, status: -1 });
        })
      });

      this.groupKeys = Object.keys(this.groups);

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
    // debugger;
    let offerComponentAttrs = this.groups[groupName];
    let res = [];
    offerComponentAttrs.forEach(function (attr) {
      if (attr.status == 1) {
        res.push(attr.name);
      }
    });
    return res;
  }

  clearSubGroupType() {
    this.groups['Hosting Party'].forEach((attr) => {
      attr.type = 0;
    });
    this.groups['Deployment'].forEach((attr) => {
      attr.type = 0;
    });
    this.groups['Delivery'].forEach((attr) => {
      attr.type = 0;
    });
    this.groups["Licensing"].forEach((attr) => {
      attr.type = 0;
    });
  }

  changeSubGroupType() {
    // debugger;
    let selectedAttrs = this.getSubgroupAttributes('Offer Components');
    this.clearSubGroupType();
    if (selectedAttrs.length == 1 && selectedAttrs.indexOf("SW - SaaS") != -1) {
      var perpetual = this.groups['Licensing'].find(obj => {
        return obj.name === 'Perpetual'
      });
      perpetual.type = 1;

      this.groups['Delivery'].forEach((attr) => {
        if (attr.name == 'Provisioning Fulfillment') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      this.groups['Deployment'].forEach((attr) => {
        if (attr.name == 'Cloud') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });
    } else if (selectedAttrs.includes("SW - SaaS") && (selectedAttrs.includes("Hardware (Commodity (x86) / Proprietary)") || selectedAttrs.includes("SW - OS") || selectedAttrs.includes("SW - OS Feature / Application / 3rd Part SW / VNF"))) {
      this.groups['Delivery'].forEach((attr) => {
        if (attr.name == 'Provisioning Fulfillment') {
          attr.type = 2;
        }
      });

      this.groups['Deployment'].forEach((attr) => {
        if (attr.name == 'Hybrid') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else if (selectedAttrs.includes("Hardware (Commodity (x86) / Proprietary)") && (selectedAttrs.includes("SW - OS") || selectedAttrs.includes("SW - OS Feature / Application / 3rd Part SW / VNF"))) {
      this.groups['Hosting Party'].forEach((attr) => {
        if (attr.name == "Hosting Party - N/A") {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      this.groups['Delivery'].forEach((attr) => {
        if (attr.name == 'Provisioning Fulfillment') {
          attr.type = 1;
        }
      });

      this.groups['Deployment'].forEach((attr) => {
        if (attr.name == 'On-Premise') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else if (selectedAttrs.length == 1 && selectedAttrs.includes("Hardware (Commodity (x86) / Proprietary)")) {

      this.groups['Hosting Party'].forEach((attr) => {
        if (attr.name == "Hosting Party - N/A") {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

      this.groups['Delivery'].forEach((attr) => {
        if (attr.name == 'Physical Fulfillment') {
          attr.type = 2;
        }
      });

      this.groups['Deployment'].forEach((attr) => {
        if (attr.name == 'On-Premise') {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });

    } else if (selectedAttrs.includes("SW - OS") || selectedAttrs.includes("SW - OS Feature / Application / 3rd Part SW / VNF")) {

      this.groups['Hosting Party'].forEach((attr) => {
        if (attr.name == "Hosting Party - N/A") {
          attr.type = 2;
        } else {
          attr.type = 1;
        }
      });
      
      this.groups['Deployment'].forEach((attr) => {
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
    if (this.groups['Offer Components'].includes(attribute)) {
      this.changeSubGroupType();
    }

    var next = 0;
    this.groupKeys.forEach(key => {
      for (let attr of this.groups[key]) {
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
      this.groups[key].forEach((attr) => {
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
        this.message = { contentHead: data['mmMapperStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is fully aligned to ${data['mmModel']}`, color: 'green', mmModel: data['mmModel'] };
      } else if (data['mmMapperStatus'] === 'Partially Aligned') {
        this.message = { contentHead: data['mmMapperStatus'], content: `  Your selected Offer Characteristics indicate that your Offer is partially aligned to ${data['mmModel']}.`, color: 
        '#ffcc00', mmModel: data['mmModel'] };
      } else {
        this.message = { contentHead: data['mmMapperStatus'], content: "  Your selection of Offer Characteristics indicate that your Offer is Not Aligned to any of the 7 Monetization Models.", color: 'red' };
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


}
