import { Component, OnInit, Input } from '@angular/core';
import { OfferSetupService } from '../../services/offer-setup.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';

@Component({
  selector: 'app-view-offer',
  templateUrl: './view-offer.component.html',
  styleUrls: ['./view-offer.component.scss']
})
export class ViewOfferComponent implements OnInit {
  selectedOffer:any = 0;
  derivedMM: any;
  Options: any[] = [];
  @Input() offerId = "ss";
  constructor(private offerSetupService: OfferSetupService, private stakeholderfullService:StakeholderfullService) { }

  ngOnInit() {
    this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(offerDetails => {
  
      this.derivedMM = offerDetails['derivedMM'];

    });
    this.offerSetupService.getModuleData(this.derivedMM,this.offerId).subscribe(data => {
      this.Options =data['listATOs'];
      console.log('this.options', this.Options);
      console.log('original data', data);
    })

  }

  selectedValue(event) {
    console.log('event', event);
  }

}
