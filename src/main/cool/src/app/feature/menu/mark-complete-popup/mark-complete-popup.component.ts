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
  milestone: String;
  milestoneStatus: String;

  constructor(private menuBarService: MenuBarService) { }

  ngOnInit() {

  }

  ngOnChanges() {
    console.log('Mark complete status in pop up contains:: ' + this.markCompleteStatus);
    this.choosePopUp();
  }

  close() {
    this.closeMarkCompletePopup.next('');
  }

  confirm() {
    if (this.currentURL.includes('offerDimension')) {
      this.milestone = 'Offer Dimension';
    } else if (this.currentURL.includes('offerSolutioning')) {
      this.milestone = 'Offer Solutioning';
    } else if (this.currentURL.includes('offerConstruct')) {
      this.milestone = 'Offer Components';
    }
    if (this.markCompleteStatus == false) {
      this.milestoneStatus = 'Available';
    } else if (this.markCompleteStatus == true) {
      this.milestoneStatus = 'Completed';
    }
    this.menuBarService.updateMarkCompleteStatus(this.offerId, this.milestone, this.milestoneStatus).subscribe((response) => {
      console.log('response has:: '+JSON.stringify(response));
      // if (this.currentURL.includes('offerDimension')) {
      //   console.log('plan status for OD:: '+JSON.stringify(response["plan"][0].status));
      //   if(response["plan"][0].status == 'Available'){
      //     this.markCompleteStatus = !this.markCompleteStatus;
      //   }
      // } else if (this.currentURL.includes('offerSolutioning')) {
      //   console.log('plan status for OS:: '+JSON.stringify(response["plan"][1].status));
      //   if(response["plan"][1].status == 'Available'){
      //     this.markCompleteStatus = !this.markCompleteStatus;
      //   }
      // } else if (this.currentURL.includes('offerSolutioning')) {
      //   console.log('plan status for OC:: '+JSON.stringify(response["plan"][2].status));
      //   if(response["plan"][2].status == 'Available'){
      //     this.markCompleteStatus = !this.markCompleteStatus;
      //   }
      // }
      this.confirmMarkComplete.next('true');
    });
   
  }

  choosePopUp() {
    if (this.markCompleteStatus === true) {
      this.title = "Mark Complete";
      this.content1 = "Marking pages as complete will lock the page for edits.";
      this.content2 = "Note that the \"Mark as Complete\" tool can be unchecked as long as Design Review approvals have not been requested.";
      this.content3 = "Please confirm if you would like to continue.";
      this.confirmButtonname = "Mark Complete";


    } else {
      this.title = "Mark Incomplete";
      this.content1 = "Un-Marking pages as complete will enable edits to be made.";
      this.content2 = "Depending upon the edits made, subsequent activities may become available again. Additionally, \"Offer Components Details\" may require manual attention as the system will not overwrite user entered data.";
      this.content3 = "Please confirm if you would like to continue.";
      this.confirmButtonname = "Confirm";
    }
  }


}
