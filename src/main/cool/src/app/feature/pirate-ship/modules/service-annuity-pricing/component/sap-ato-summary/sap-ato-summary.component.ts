import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PirateShipSharedService} from '@app/services/pirate-ship-shared.service';

@Component({
  selector: 'app-sap-ato-summary',
  templateUrl: './sap-ato-summary.component.html',
  styleUrls: ['./sap-ato-summary.component.scss']
})
export class SapAtoSummaryComponent implements OnInit {

  @Input('offerId')offerId: string;
  @Input('caseId')caseId: string;
  @Input('atoNames') atoNames: any = [];
  @Input('selectedAto')selectedAto: string;

  response: any;
  loading: boolean = true;
  showbutton: boolean  = true;
  Atosummary_be_sub: any = {
    atoName: 'AtoName',
    clickable: true,
    skuList: [
      {
        "sku":"sku1",
        "plpPercentage":"10%",
        "ranking":"1",
        "monthlyThreshold":"0"
      },
      {
        "sku":"sku2",
        "plpPercentage":"",
        "ranking":"",
        "monthlyThreshold":"6000"
      },
      {
        "sku":"sku3",
        "plpPercentage":"",
        "ranking":"",
        "monthlyThreshold":"6000"
      },
      {
        "sku":"sku4",
        "plpPercentage":"16%",
        "ranking":"2",
        "monthlyThreshold":"6888"
      },
      {
        "sku":"sku5",
        "plpPercentage":"30%",
        "ranking":"3",
        "monthlyThreshold":"5500"
      },
      {
        "sku":"sku6",
        "plpPercentage":"66%",
        "ranking":"4",
        "monthlyThreshold":"3000"
      }
    ]
  };
  Atosummary_af_sub: any = {};
  middlenumber: any;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private _pirateshipService: PirateShipSharedService
  ) { }

  ngOnInit() {
    //this.atoNames = this._offersetupService.getAtolist();
    // if (this._pirateshipService.getRole() === "SOE") {
    //   this.showbutton = true;
    // } else {
    //   this.showbutton = false;
    // }
    this.Atosummary_af_sub = {
      "ATO":"",
      "caseID":"",
      status:"",
      skuList:[
      ]
    };
    // this.updatedata()
    this.updatawithoutAPi();
    // ßthis.updatedata();

    this.middlenumber = Math.ceil(this.Atosummary_be_sub.skuList.length / 2) - 1;

  }

  updateATo(seletedATO: any) {
    this.selectedAto = seletedATO;
  }


  updatecasestatus() {

    this.Atosummary_be_sub.clickable = false;

    this.Atosummary_af_sub = {
      "ATO":"AtoName",
      "caseID":"case#124",
      status:"Complete",
      skuList: [
        {
          "sku":"sku1",
          "basedSupportItem":true
        },
        {
          "sku":"sku2",
          "basedSupportItem":true
        },
        {
          "sku":"sku3",
          "basedSupportItem":false
        },
        {
          "sku":"sku4",
          "basedSupportItem":true
        },
        {
          "sku":"sku5",
          "basedSupportItem":false
        },
        {
          "sku":"sku6",
          "basedSupportItem":true
        }
      ]
    };

  }
  updatawithoutAPi() {
    this.loading = false;
    this.Atosummary_be_sub.clickable = true;
    for (let i = 0; i < this.Atosummary_be_sub.skuList.length; i++) {
      this.Atosummary_af_sub.skuList.push({
        "sku":"",
        "basedSupportItem":false

      });
    }

  }
  // updatedata(){

  //   this._offersetupService.getPricing_SKU_Detail(this.offerId, this.selectedAto).subscribe(
  //     (response) => {
  //       this.loading = false;
  //       this.Atosummary_af_sub.skuList=[];
  //       this.Atosummary_be_sub =[];
  //       this.Atosummary_be_sub = response;
  //       for (let i =0; i < this.Atosummary_be_sub.skuList.length; i++) {
  //         this.Atosummary_af_sub.skuList.push({
  //           "sku":"",
  //           "basedSupportItem":false

  //         });
  //       }

  //     }
  //   );

  // }

  showSelectedAtoView(atoname: string) {

    // this.router.navigate(['../',appRoutesNames.PIRATE_SHIP, this.offerId, this.caseId, pirateShipRoutesNames.SERVICE_ANNUITY_PRICING, this.selectedAto]);
    // this.loading = true;


    if(atoname === 'Overall Offer') {
      this.router.navigate(['../offerSetup',this.offerId,this.caseId,'service-annuity-pricing','Overall Offer']);
    }
    else {

      this.Atosummary_be_sub =  {
        atoName: 'AtoName',
        clickable: true,
        skuList: [
          {
            "sku":"sku1",
            "plpPercentage":"10%",
            "ranking":"1",
            "monthlyThreshold":"0"
          },
          {
            "sku":"sku2",
            "plpPercentage":"",
            "ranking":"",
            "monthlyThreshold":"6000"
          },
          {
            "sku":"sku3",
            "plpPercentage":"",
            "ranking":"",
            "monthlyThreshold":"6000"
          },
          {
            "sku":"sku4",
            "plpPercentage":"16%",
            "ranking":"2",
            "monthlyThreshold":"6888"
          },
          {
            "sku":"sku5",
            "plpPercentage":"30%",
            "ranking":"3",
            "monthlyThreshold":"5500"
          },
          {
            "sku":"sku6",
            "plpPercentage":"66%",
            "ranking":"4",
            "monthlyThreshold":"3000"
          }
        ]
      };
      this.Atosummary_af_sub = {
        "ATO":"",
        "caseID":"",
        status:"",
        skuList:[
        ]
      };
      this.updatawithoutAPi();
      // this.updatedata();
      this.selectedAto = atoname;
    }


  }

}
