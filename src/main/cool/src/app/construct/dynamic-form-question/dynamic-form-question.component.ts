import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OfferConstructService } from '@app/services/offer-construct.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

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
  @Input() questionList: FormGroup;
  minDate: Date;

  constructor(public offerConstructService: OfferConstructService) {
  }

  ngOnInit() {
    this.minDate = new Date();
  }

  addAllDetailsValidationsonChange(e, question) {
    if (this.questionList !== undefined) {
      if (question.question == "SOA Pricing") {
        if (question.currentValue == "Flat") {
          this.setBasePriceInBillingSOADForFlat(this.questionList);
        }

        if (question.currentValue == "% of Product List") {
          this.setBasePriceInBillingSOAForProduct(this.questionList);
        }
      }
    }
  }

  //set basePrice value according to pricing type
  setBasePriceInBillingSOADForFlat(questionList) {
    let monthlyAmountValue;
    questionList.forEach(question => {
      if (question.question == "Monthly Amount") {
        monthlyAmountValue = question.currentValue;
      }
    });

    questionList.forEach(question => {
      if (question.question == "Base Price") {
        question.currentValue = monthlyAmountValue;
      }
    });
  }

  setBasePriceInBillingSOAForProduct(questionList) {
    questionList.forEach(question => {
      if (question.question == "Base Price") {
        question.currentValue = 1;
      }
    });
  }



}
