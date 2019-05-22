import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuBarService } from '@app/services/menu-bar.service';

@Component({
  selector: 'app-mark-complete-popup',
  templateUrl: './mark-complete-popup.component.html',
  styleUrls: ['./mark-complete-popup.component.css']
})
export class MarkCompletePopupComponent implements OnInit {

  @Input() show: boolean;
  @Input() markCompleteStatus: boolean;
  @Input() offerId;
  @Input() caseId;
  @Input() currentURL;
  @Output() closeMarkCompletePopup = new EventEmitter<string>();
  @Output() confirmMarkComplete = new EventEmitter<string>();
  

  constructor(private menuBarService: MenuBarService) { }

  ngOnInit() {

  }

  close() {
    this.closeMarkCompletePopup.next('');
  }

  confirm() {
    let updataStatusData = {};
    updataStatusData['offerName'] = this.offerId;
    updataStatusData['caseId'] = this.caseId;
    if (this.currentURL.includes('offerDimension')) {
      updataStatusData['offerDimension_toggleStatus'] = !this.markCompleteStatus;
  } else if(this.currentURL.includes('offerSolutioning')){
    updataStatusData['offerSolutioning_toggleStatus'] = !this.markCompleteStatus;
  } else if (this.currentURL.includes('offerComponent')){
    updataStatusData['offerComponent_toggleStatus'] = !this.markCompleteStatus;
  }
    this.menuBarService.updateMarkCompleteStatus(updataStatusData).subscribe(() => {
      this.confirmMarkComplete.next('');
    });
   
  }


}
