import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-notification-offer-detail-popup',
  templateUrl: './notification-offer-detail-popup.component.html',
  styleUrls: ['./notification-offer-detail-popup.component.css']
})
export class NotificationOfferDetailPopupComponent implements OnInit, OnChanges {

  @Input() selectedAction

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    let selectedActionChange = changes.selectedAction;
    this.selectedAction = selectedActionChange ? selectedActionChange.currentValue : this.selectedAction;
  }

}
