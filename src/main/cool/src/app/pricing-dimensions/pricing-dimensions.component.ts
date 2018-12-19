import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-pricing-dimensions',
  templateUrl: './pricing-dimensions.component.html',
  styleUrls: ['./pricing-dimensions.component.css']
})
export class PricingDimensionsComponent implements OnInit {
  @Input()  pricingDimensionsGroup: Object;
  constructor() { }

  ngOnInit() {
  }

}
