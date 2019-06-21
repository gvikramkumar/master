import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PirateShipSharedService} from '@app/services/pirate-ship-shared.service';
import {OfferSetupService} from '@app/services/offer-setup.service';

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
  Atosummary_af_sub: any = {};
  middlenumber: any;
  setupEnable: boolean = true;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private _pirateshipService: PirateShipSharedService,
              private _offersetupService: OfferSetupService
  ) { }

  ngOnInit() {
    this._pirateshipService.update_pricing.subscribe((res: any) => {
      this.selectedAto = res;
      this.updatedata();
    });
    //this.atoNames = this._offersetupService.getAtolist();
    // if (this._pirateshipService.getRole() === "SOE") {
    //   this.showbutton = true;
    // } else {
    //   this.showbutton = false;
    // }
    this.Atosummary_af_sub = {
      "offerId": "",
      "caseId": null,
      "caseStatus": null,
      "setupEnable": true,
      "atoName": "",
      "billingSKUs": []
    }
     this.updatedata();


  }

  updateATo(seletedATO: any) {
    this.selectedAto = seletedATO;
  }


   updatecasestatus() {
     this.loading = true;
     let billingItemNames = [];
     if (this.Atosummary_af_sub && this.Atosummary_af_sub.billingSKUs) {
      for (let i = 0; i < this.Atosummary_af_sub.billingSKUs.length; i++) {
        billingItemNames.push(this.Atosummary_af_sub.billingSKUs[i].skuName)
      }
      let payload = { "coolOfferId": this.offerId, "itemName": this.selectedAto,"billingItemNames": billingItemNames};
      this._offersetupService.submit_pricing_percentage(payload).subscribe(
       (response) => {
         this.updatedata(); // can be removed
         this.loading = false;
       }, error => {
         this.updatedata(); // can be removed
         console.log('error', error);// why its not going to error
         this.loading = false;
       })
     } else {
       this.loading = false;
     }
   }

  updatedata() {
    this._offersetupService.getPricing_SKU_Detail(this.offerId, this.selectedAto).subscribe(
      (response) => {
        this.loading = false;
        this.Atosummary_af_sub = response;
        if (this.Atosummary_af_sub.skuList) {

          this.middlenumber = Math.ceil(this.Atosummary_af_sub.skuList.length / 2) - 1;
        }
        if (this.Atosummary_af_sub.setupEnable) {
          this.setupEnable = false;
        } else {
          this.setupEnable = true;
        }
      }
    );
  }

  showSelectedAtoView(atoname: string) {

    this.loading = true;


    if( atoname === 'Overall Offer') {
      this.router.navigate(['../offerSetup',this.offerId,this.caseId,'service-annuity-pricing','Overall Offer']);
    }

    else {


       this.updatedata();
      this.selectedAto = atoname;
    }


  }

}
