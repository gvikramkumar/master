import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mark-complete-popup',
  templateUrl: './mark-complete-popup.component.html',
  styleUrls: ['./mark-complete-popup.component.css']
})
export class MarkCompletePopupComponent implements OnInit {

  @Input() show: boolean;
  @Output() closeMarkCompletePopup = new EventEmitter<string>();
  @Output() confirmMarkComplete = new EventEmitter<string>();
  

  constructor() { }

  ngOnInit() {

  }

  close() {
    this.closeMarkCompletePopup.next('');
  }

  confirm() {
    this.confirmMarkComplete.next('');
  }

}
