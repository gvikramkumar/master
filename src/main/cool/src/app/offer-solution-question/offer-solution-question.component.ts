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
  }
}
