import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActionsService } from '@app/services/actions.service';

@Component({
  selector: 'app-notification-offer-detail-popup',
  templateUrl: './notification-offer-detail-popup.component.html',
  styleUrls: ['./notification-offer-detail-popup.component.css']
})
export class NotificationOfferDetailPopupComponent implements OnInit, OnChanges {

  @Input() selectedAction
  milestone
  dueDate
  constructor(private actionsService: ActionsService) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    let selectedActionChange = changes.selectedAction;
    this.selectedAction = selectedActionChange ? selectedActionChange.currentValue : this.selectedAction;
    this.actionsService.getActionDetails(this.selectedAction.taskId)
    .subscribe(data => {
      this.milestone = data.milestone;
      this.dueDate = data.dueDate;
    });
  }

}
