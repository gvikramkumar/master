import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Input() disableMessage;
  @Output() closeMarkCompletePopup = new EventEmitter<string>();
  @Output() confirmMarkComplete = new EventEmitter<string>();
  content1: String;
  content2: String;
  content3: String;
  confirmButtonname: String;
  title: String;
  milestone: String;
  milestoneStatus: String;

  constructor() {
      }

  ngOnInit() {
    }

  ngOnChanges() {
    this.choosePopUp();
  }

  close() {
    this.closeMarkCompletePopup.next('');
  }

  confirm() {
    this.confirmMarkComplete.next('true');
  }

  choosePopUp() {
    //if(this.disableMessage === '' || this.disableMessage === undefined){
    if (this.markCompleteStatus === true) {
        this.title = "Mark Complete";
        this.content1 = "Marking pages as complete will lock the page for edits.";
        this.content2 = "Note that the \"Mark as Complete\" tool can be unchecked as long as Design Review approvals have not been requested.";
        this.content3 = "Please confirm if you would like to continue.";
        //this.confirmButtonname = "Mark Complete";


      } else {
        this.title = "Mark Incomplete";
        this.content1 = "Un-Marking pages as complete will enable edits to be made.";
        this.content2 = "Depending upon the edits made, subsequent activities may become available again. Additionally, \"Offer Components Details\" may require manual attention as the system will not overwrite user entered data.";
        this.content3 = "Please confirm if you would like to continue.";
        //this.confirmButtonname = "Continue";
      }
  //   }
  // else{
  //     this.title = "Note";
  //     console.log('disable message::::: '+this.disableMessage);
  //     console.log('show popup::: '+this.show);
  //     this.content1 = this.disableMessage;
  //     this.content2 = '';
  //     this.content3 = '';
  //     //this.confirmButtonname = "Continue";
  //   }
  }
  }
