import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { reference } from '@angular/core/src/render3';


@Component({
  selector: 'app-offer-solution-question',
  templateUrl: './offer-solution-question.component.html',
  styleUrls: ['./offer-solution-question.component.css']
})
export class OfferSolutionQuestionComponent implements OnInit {

  @Input() question: any;
  @Input() groupData: Array<any>;
  @Input() unGroupData: Array<any>;
  @Input() questionGroup: FormGroup;


  caseId: string;
  currentOfferId: string;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.caseId = params['id2'];
    });
  }

  ngOnInit() {
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });
  }

  showHiddenQuestionBasedOnUserInput(selectedValue: string, question: any) {

    if (selectedValue !== '' && selectedValue !== 'No') {

      const parentQuestionNumber = question['questionNo'];
      const childIndexUnGroupData = this.unGroupData.findIndex(fqa => parentQuestionNumber === fqa.rules.referenceQ);

      if (childIndexUnGroupData !== -1) {

        const childQuestion = this.unGroupData[childIndexUnGroupData];
        const childQuestionNumber = this.unGroupData[childIndexUnGroupData]['questionNumber'];

        const group = childQuestion['group'];
        const osGroup = childQuestion['osGroup'];
        const subGroup = childQuestion['subGroup'];

        const childIndexGroupData = this.groupData[osGroup][group][subGroup].findIndex(cqa => cqa.questionNo === childQuestionNumber);
        this.groupData[osGroup][group][subGroup][childIndexGroupData]['hideQuestion'] = false;

      }

    }

  }
}





