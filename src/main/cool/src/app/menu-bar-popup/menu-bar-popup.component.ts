import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MenuBarService } from '../services/menu-bar.service'


@Component({
  selector: 'app-menu-bar-popup',
  templateUrl: './menu-bar-popup.component.html',
  styleUrls: ['./menu-bar-popup.component.css']
})
export class MenuBarPopupComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() popupType: String = "";
  @Output() closePopup = new EventEmitter<string>();
  currentOfferId: String;

  constructor(private activatedRoute: ActivatedRoute,
    private menuBarService: MenuBarService
    ) { 
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
    });
  }

  ngOnInit() { 
  }
  

  getPopupTitle() {
    if (this.popupType == "hold") {
      return "Add a Reason to place the Offer on Hold"
    } else if (this.popupType == "cancel") {
      return "Add a Reason for Cancellation"
    } else {
      return "Popup Title";
    }
  }

  close() {
    this.closePopup.next("");
  }

  submit() {
    // debugger;
    if (this.popupType == 'hold') {
      this.menuBarService.holdOffer(this.currentOfferId,).subscribe();
    } else if (this.popupType == 'cancel') {
      this.menuBarService.cancelOffer(this.currentOfferId,).subscribe();
    }
    this.closePopup.next("");
  }

}
