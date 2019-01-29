import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offer-solution-question',
  templateUrl: './offer-solution-question.component.html',
  styleUrls: ['./offer-solution-question.component.css']
})
export class OfferSolutionQuestionComponent implements OnInit {
  @Input() questionData:Object;
  @Input() questionIndex:number;
  constructor() { }

  ngOnInit() {
  }

}
