import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';


@Component({
  selector: 'app-offersolutioning-card-one',
  templateUrl: './offer-solutioning-card-one.component.html',
  styleUrls: ['./offer-solutioning-card-one.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm }]
})
export class OffersolutioningCardOneComponent implements OnInit {

  Object = Object;
  @Input() groupData: Array<any>;
  @Input() unGroupData: Array<any>;
  @Input() selectedGroupData: Object;
  @Input() markCompleteStatus;

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