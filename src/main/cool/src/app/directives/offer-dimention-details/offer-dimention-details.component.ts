import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offer-dimention-details',
  templateUrl: './offer-dimention-details.component.html',
  styleUrls: ['./offer-dimention-details.component.css']
})
export class OfferDimentionDetailsComponent implements OnInit {
  @Input() dimensionGroup: string;
  @Input() dimensionSubgroup: string;

  constructor() { }

  ngOnInit() {
  }

}
