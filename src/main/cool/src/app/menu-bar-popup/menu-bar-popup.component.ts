import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MenuBarService } from '../services/menu-bar.service';
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-menu-bar-popup',
  templateUrl: './menu-bar-popup.component.html',
  styleUrls: ['./menu-bar-popup.component.css']
})
export class MenuBarPopupComponent implements OnInit {
  @Input() show = false;
  @Input() popupType: String = '';
  @Output() closePopup = new EventEmitter<string>();
  currentOfferId: String;
  caseId: String;
  reason: String = '';
  allowSubmit: boolean = false;
  passedString : String = '';
  buttonIsDisabled: boolean = false;


  constructor(private activatedRoute: ActivatedRoute,
    private menuBarService: MenuBarService,
    private userService: UserService,
    ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];

    });
  }

  ngOnInit() {
  }

  enableSubmit(event): void {
   let passedString = event.target.value;
   let inputValue = passedString.trim();
   if(inputValue === "" || inputValue === null) {
    this.buttonIsDisabled=false;
   } else {
    this.buttonIsDisabled=true;
   }
}

  getPopupTitle() {
    if (this.popupType === 'hold') {
      return 'Add a Reason to place the Offer on Hold';
    } else if (this.popupType === 'cancel') {
      return 'Add a Reason for Cancellation';
    } else {
      return 'Popup Title';
    }
  }

  close() {
    this.closePopup.next('');
    this.reason = '';
  }

  submit() {
    let holdData= {};
    holdData['taskId'] = '';
    holdData['userId'] = this.userService.getUserId();
    holdData['caseId'] = this.caseId;
    holdData['offerId'] = this.currentOfferId;
    holdData['taskName'] = 'discard';
    holdData['action'] = 'hold';
    holdData['comment'] = this.reason;

    let cancelData={};
    cancelData['taskId'] = '';
    cancelData['userId'] = this.userService.getUserId();
    cancelData['caseId'] = this.caseId;
    cancelData['offerId'] = this.currentOfferId;
    cancelData['taskName'] = 'discard';
    cancelData['action'] = 'cancel';
    cancelData['comment'] = this.reason;

    if (this.popupType === 'hold') {
      this.menuBarService.holdOffer(holdData).subscribe(res => {
        this.closePopup.next('hold');
      });
    } else if (this.popupType === 'cancel') {
      this.menuBarService.cancelOffer(cancelData).subscribe(res => {
        this.closePopup.next('cancel');
      });
    }
    
  }

}
