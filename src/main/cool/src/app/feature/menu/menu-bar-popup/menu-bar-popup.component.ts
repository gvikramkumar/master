
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/core/services';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MenuBarService } from '@app/services/menu-bar.service';

@Component({
  selector: 'app-menu-bar-popup',
  templateUrl: './menu-bar-popup.component.html',
  styleUrls: ['./menu-bar-popup.component.css']
})
export class MenuBarPopupComponent implements OnInit {

  @Input() show = false;
  @Input() popupType: String = '';
  @Output() closePopup = new EventEmitter<string>();

  caseId: String;
  reason: String = '';
  currentOfferId: String;
  passedString: String = '';
  allowSubmit: boolean = false;
  buttonIsDisabled: boolean = false;

  // ---------------------------------------------------------------------

  constructor(private activatedRoute: ActivatedRoute,
    private menuBarService: MenuBarService,
    private userService: UserService,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
    });
  }

  // ---------------------------------------------------------------------

  ngOnInit() {
  }

  // ---------------------------------------------------------------------

  getPopupTitle() {
    if (this.popupType === 'hold') {
      return 'Add a Reason to place the Offer on Hold';
    } else if (this.popupType === 'cancel') {
      return 'Add a Reason for Cancellation';
    } else {
      return 'Popup Title';
    }
  }

  enableSubmit(event): void {
    const passedString = event.target.value;
    const inputValue = passedString.trim();
    if (inputValue === "" || inputValue === null) {
      this.buttonIsDisabled = false;
    } else {
      this.buttonIsDisabled = true;
    }
  }

  // ---------------------------------------------------------------------

  close() {
    this.closePopup.next('');
    this.reason = '';
  }

  submit() {

    const holdData = {};
    holdData['taskId'] = '';
    holdData['userId'] = this.userService.getUserId();
    holdData['caseId'] = this.caseId;
    holdData['offerId'] = this.currentOfferId;
    holdData['taskName'] = 'discard';
    holdData['action'] = 'hold';
    holdData['comment'] = this.reason;

    const cancelData = {};
    cancelData['taskId'] = '';
    cancelData['userId'] = this.userService.getUserId();
    cancelData['caseId'] = this.caseId;
    cancelData['offerId'] = this.currentOfferId;
    cancelData['taskName'] = 'discard';
    cancelData['action'] = 'cancel';
    cancelData['comment'] = this.reason;

    if (this.popupType === 'hold') {
      this.menuBarService.holdOffer(holdData).subscribe(() => {
        this.closePopup.next('hold');
      });
    } else if (this.popupType === 'cancel') {
      this.menuBarService.cancelOffer(cancelData).subscribe(() => {
        this.closePopup.next('cancel');
      });
    }

  }

  // ---------------------------------------------------------------------

}
