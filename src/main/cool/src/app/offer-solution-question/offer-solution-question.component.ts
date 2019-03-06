import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OffersolutioningService } from '../services/offersolutioning.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-offer-solution-question',
  templateUrl: './offer-solution-question.component.html',
  styleUrls: ['./offer-solution-question.component.css']
})
export class OfferSolutionQuestionComponent implements OnInit {
  @Input() questionData: Object;
  @Input() questionIndex: number;
  @Input() stakeData: Object;
  @Input() offerData: Object;
  @Input() groupIndex: any;

  currentOfferId: string;
  caseId: string;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  constructor(
    private activatedRoute: ActivatedRoute,
    private offersolutioningService: OffersolutioningService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
  }

  ngOnInit() {
    if (this.questionData['questionType'] === 'Date') {
      this.questionData['answerToQuestion'] = this.questionData['answerToQuestion'] ? new Date(this.questionData['answerToQuestion']) : '';
    }
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });
  }
}
