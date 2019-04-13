import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OfferConstructService } from '@app/services/offer-construct.service';

@Component({
  selector: 'app-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.css']
})
export class DynamicFormQuestionComponent implements OnInit {
  @Input() question: any;
  @Input() questionForm: FormGroup;
  @Input() offerForm: FormGroup;
  @Input() headerName: FormGroup;
  constructor(public offerConstructService: OfferConstructService) {
  }

  ngOnInit() { }



}
