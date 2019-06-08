import { Component, OnInit, Input } from '@angular/core';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';

@Component({
  selector: 'app-mm-info-bar',
  templateUrl: './mm-info-bar.component.html',
  styleUrls: ['./mm-info-bar.component.css']
})
export class MmInfoBarComponent implements OnInit {

  offerData;
  @Input() derivedMM: any;
  @Input() currentOfferId;



  constructor(private stakeholderfullService: StakeholderfullService) { }

  ngOnInit() {
    this.stakeholderfullService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {
      this.offerData = data;
      this.derivedMM = this.offerData['derivedMM'];
    });

  }

}
