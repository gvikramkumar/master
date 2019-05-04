import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-atosummary',
  templateUrl: './atosummary.component.html',
  styleUrls: ['./atosummary.component.scss']
})
export class ATOSummaryComponent implements OnInit {
     offerId: string;
     selectedoffer: string;
     Atosummary_be_sub: any = {
       ATO: 'AtoName',
       listSKUs: [
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
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.Atosummary_af_sub = {
      "ATO":"",
      "caseID":"",
      status:"",
      listSKUs:[
      ]
    };
    for(let i =0; i< this.Atosummary_be_sub.listSKUs.length; i++){
         this.Atosummary_af_sub.listSKUs.push({
           "sku":"",
           "basedSupportItem":false

         });
    }

   this.middlenumber = Math.ceil(this.Atosummary_be_sub.listSKUs.length / 2) - 1;

    this.offerId = this.route.snapshot.params.offerId;
    this.selectedoffer = this.route.snapshot.params.selectedAto;
  }

  updateATo(seletedATO: any) {
    this.selectedoffer = seletedATO;
    console.log('this  place will call API for update' + seletedATO + 'pricing' + this.offerId);

  }

  back() {
    this.router.navigate(['../../offerset'],{relativeTo:this.route});
  }

  updatecasestatus() {
    this.Atosummary_af_sub = {
      "ATO":"AtoName",
      "caseID":"case#124",
      status:"Complete",
      listSKUs:[
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
}
