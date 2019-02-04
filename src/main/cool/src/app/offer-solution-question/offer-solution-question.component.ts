import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {OffersolutioningService} from '../services/offersolutioning.service';

@Component({
  selector: 'app-offer-solution-question',
  templateUrl: './offer-solution-question.component.html',
  styleUrls: ['./offer-solution-question.component.css']
})
export class OfferSolutionQuestionComponent implements OnInit {
  @Input() questionData:Object;
  @Input() questionIndex:number;
  @Input() stakeData:Object;
  @Input() offerData:Object;
  currentOfferId:string;
  caseId:string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private offersolutioningService:OffersolutioningService
  )
  {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
  }

  ngOnInit() {
    const assignees = [];
    if (this.questionData['primaryPOC'] != null && this.questionData['primaryPOC'].length > 0) {
      this.questionData['primaryPOC'].forEach(element => {
        if (this.stakeData[element] != null && this.stakeData[element].length > 0) {
          this.stakeData[element].forEach(assignee => {
            assignees.push(assignee);
          });
        }
      });
    }
    let owner = '';
    if (this.stakeData['Owner'] != null && this.stakeData['Owner'].length > 0) {
      owner = this.stakeData['Owner'][0];
    }
    let dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 5);
    let notificationPayload = {
      "offerId": this.currentOfferId,
      "caseId": this.caseId,
      "actionTitle": "Provide Details",
      "description": "This offer need more information",
      "mileStone": "Offer Solutioning",
      "selectedFunction": this.questionData['primaryPOC'] !=null ? this.questionData['primaryPOC'].join(',') : '' ,
      "assignee": assignees,
      "dueDate": dueDate.toISOString(),
      "owner": owner,
      "offerName": this.offerData['offerName'],
      "type": "Notification",
      };
      this.offersolutioningService.notificationPost(notificationPayload).subscribe(result => {
        console.log(notificationPayload);
      });

  }

}
