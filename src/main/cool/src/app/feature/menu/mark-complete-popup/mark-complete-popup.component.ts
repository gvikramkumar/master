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
  content1: String;
  content2: String;
  content3: String;
  confirmButtonname: String;
  title: String;
  

  constructor(private menuBarService: MenuBarService) { }

  ngOnInit() {

  }

  ngOnChanges(){
    this.choosePopUp();
  }

  close() {
    this.closeMarkCompletePopup.next('');
  }

  confirm() {
    let updataStatusData = {};
    updataStatusData['offerId'] = this.offerId;
    updataStatusData['caseId'] = this.caseId;
    if (this.currentURL.includes('offerDimension')) {
      updataStatusData['offerDimension_toggleStatus'] = this.markCompleteStatus;
  } else if(this.currentURL.includes('offerSolutioning')){
    updataStatusData['offerSolutioning_toggleStatus'] = this.markCompleteStatus;
  } else if (this.currentURL.includes('offerConstruct')){
    updataStatusData['offerComponent_toggleStatus'] = this.markCompleteStatus;
  }
    this.menuBarService.updateMarkCompleteStatus(updataStatusData).subscribe(() => {
      this.confirmMarkComplete.next('');
    });
   
  }

  choosePopUp() {
    if(this.markCompleteStatus === true) {
      this.title = "Mark Complete";
      this.content1 = "Marking pages as complete will lock the page for edits.";
      this.content2 = "Mark as Complete tool can be unchecked as long as Design Review approvals have not been requested.";
      this.content3 = "Please confirm if you would like to continue.";
      this.confirmButtonname = "Mark Complete";

      
    } else{
      this.title = "Uncheck Complete";
      this.content1 = "Do you want to uncheck the Mark As Complete Tool?";
      this.content2 = "";
      this.content3 = "";
      this.confirmButtonname ="Uncheck";
    }
  }


}
