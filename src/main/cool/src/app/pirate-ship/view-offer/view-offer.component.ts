import { Component, OnInit, Input } from '@angular/core';
import { OfferSetupService } from '../../services/offer-setup.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';

@Component({
  selector: 'app-view-offer',
  templateUrl: './view-offer.component.html',
  styleUrls: ['./view-offer.component.scss']
})
export class ViewOfferComponent implements OnInit {

  derivedMM: any;
  Options: any[] = [];
  functionalRole: any = 'BUPM';
  selectedOffer: any = 0;
  @Input() offerId = "ss";
  constructor(private offerSetupService: OfferSetupService, private stakeholderfullService: StakeholderfullService) { }

  ngOnInit() {

    this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(offerDetails => {
      this.derivedMM = offerDetails['derivedMM'];
    });
    this.offerSetupService.getModuleData(this.derivedMM,this.offerId,this.functionalRole).subscribe(data => {
      this.Options =data['listATOs'];
     
    });

  }

  selectedValue(event) {

  }

}
