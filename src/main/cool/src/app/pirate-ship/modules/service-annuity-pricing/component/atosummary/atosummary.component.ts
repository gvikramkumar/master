import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OfferSetupService} from '@app/services/offer-setup.service';

@Component({
  selector: 'app-atosummary',
  templateUrl: './atosummary.component.html',
  styleUrls: ['./atosummary.component.scss']
})
export class ATOSummaryComponent implements OnInit {
     @Input('offerId')offerId: string;
     @Input('atoNames') atoNames: any = [];
     @Input('selectedAto')selectedAto: string;

     response: any;
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
              private _offersetupService: OfferSetupService
              ) { }

  ngOnInit() {
     this.atoNames = this._offersetupService.getAtolist();

     this._offersetupService.getPricing_SKU_Detail(this.offerId, this.selectedAto).subscribe(
       (response) => {
         debugger;
         this.Atosummary_be_sub = response;
         for (let i =0; i < this.Atosummary_be_sub.skuList.length; i++) {
           this.Atosummary_af_sub.skuList.push({
             "sku":"",
             "basedSupportItem":false

           });
         }

       }
     );

    this.Atosummary_af_sub = {
      "ATO":"",
      "caseID":"",
      status:"",
      skuList:[
      ]
    };

   this.middlenumber = Math.ceil(this.Atosummary_be_sub.skuList.length / 2) - 1;


  }

  updateATo(seletedATO: any) {
    this.selectedAto = seletedATO;


  }


  updatecasestatus() {



    // this.Atosummary_af_sub = {
    //   "ATO":"AtoName",
    //   "caseID":"case#124",
    //   status:"Complete",
    //   skuList:[
    //     {
    //       "sku":"sku1",
    //       "basedSupportItem":true
    //     },
    //     {
    //       "sku":"sku2",
    //       "basedSupportItem":true
    //     },
    //     {
    //       "sku":"sku3",
    //       "basedSupportItem":false
    //     },
    //     {
    //       "sku":"sku4",
    //       "basedSupportItem":true
    //     },
    //     {
    //       "sku":"sku5",
    //       "basedSupportItem":false
    //     },
    //     {
    //       "sku":"sku6",
    //       "basedSupportItem":true
    //     }
    //   ]
    // };

  }

  showSelectedAtoView($event: string) {

  }
}
