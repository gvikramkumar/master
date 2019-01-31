import { Component, OnInit, Input } from '@angular/core';
import { StakeholderfullService } from '../services/stakeholderfull.service';

@Component({
  selector: 'app-mm-info-bar',
  templateUrl: './mm-info-bar.component.html',
  styleUrls: ['./mm-info-bar.component.css']
})
export class MmInfoBarComponent implements OnInit {
  @Input() derivedMM: any;
  @Input() currentOfferId;
  offerData;
  

  constructor(private stakeholderfullService: StakeholderfullService) { }

  ngOnInit() {
    debugger;
    this.stakeholderfullService.getdata(this.currentOfferId).subscribe(data => {
      this.offerData = data;
      this.derivedMM = this.offerData['derivedMM'];
    })

}

}
