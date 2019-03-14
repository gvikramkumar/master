import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offersolutioning-card-one',
  templateUrl: './offer-solutioning-card-one.component.html',
  styleUrls: ['./offer-solutioning-card-one.component.css']
})
export class OffersolutioningCardOneComponent implements OnInit {
  @Input() groupData: Object;
  @Input() stakeData: Object;
  @Input() offerData: Object;
  @Input() groupIndex: any;
  Object = Object;
  constructor() { }

  ngOnInit() {
  }

  checkButtonStatus(attribute, selectedAttribute) {
    if (selectedAttribute != null && selectedAttribute.includes(attribute)) {
      return true;
    } else {
      return false;
    }
  }
}
