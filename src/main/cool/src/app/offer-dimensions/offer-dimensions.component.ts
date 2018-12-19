import { Component, OnInit, Input } from '@angular/core';
import { MonetizationModelService } from '../services/monetization-model.service';

@Component({
  selector: 'app-offer-dimensions',
  templateUrl: './offer-dimensions.component.html',
  styleUrls: ['./offer-dimensions.component.css']
})
export class OfferDimensionsComponent implements OnInit {
  @Input() offerDimensionsGroup: Object;

  constructor() { }

  ngOnInit() {

    
  }

}
