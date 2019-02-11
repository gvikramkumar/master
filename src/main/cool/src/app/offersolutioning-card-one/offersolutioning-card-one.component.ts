import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offersolutioning-card-one',
  templateUrl: './offersolutioning-card-one.component.html',
  styleUrls: ['./offersolutioning-card-one.component.css']
})
export class OffersolutioningCardOneComponent implements OnInit {
  @Input() groupData:Object;
  @Input() stakeData:Object;
  @Input() offerData:Object;
  @Input() groupIndex:any;

  constructor() { }

  ngOnInit() {
  }

  checkButtonStatus(btn) {
    if (this.groupData['selected'] != null && this.groupData['selected'].includes(btn)) {
      return true;
    } else {
      return false;
    }
  }
}
