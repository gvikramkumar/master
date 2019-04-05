import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup, ControlContainer, NgForm } from '@angular/forms';
import * as moment from 'moment';


@Component({
  selector: 'app-offer-solution-question',
  templateUrl: './offer-solution-question.component.html',
  styleUrls: ['./offer-solution-question.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
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

  validateDate(childDate: string, question: any) {
    let invalidDate:boolean = false;
    const group = question['group'];
    const osGroup = question['oSgroup'];
    const subGroup = question['subGroup'];
    const parentIndex = this.groupData[osGroup][group][subGroup]['questions'].findIndex(qna => qna.question === 'Announcement Start Date: ')
    let parentDate:string = this.groupData[osGroup][group][subGroup]['questions'][parentIndex]['answerToQuestion']
    moment(parentDate).format('MM/DD/YYYY');
    if(moment(childDate).diff(parentDate) > 180) 
       invalidDate = true;
  }

  showHiddenQuestionBasedOnUserInput(selectedValue: string, question: any) {

    if (selectedValue !== '') {

      const parentQuestionNumber = question['questionNo'];
      const childIndexUnGroupData = this.unGroupData.findIndex(fqa => parentQuestionNumber === fqa.rules.referenceQ);

      if (childIndexUnGroupData !== -1) {

        const childQuestion = this.unGroupData[childIndexUnGroupData];
        const childQuestionNumber = this.unGroupData[childIndexUnGroupData]['questionNo'];

        const group = childQuestion['group'];
        const osGroup = childQuestion['oSgroup'];
        const subGroup = childQuestion['subGroup'];

        const childQuestionsGroup = this.groupData[osGroup][group][subGroup]['questions'] as Array<any>;
        const childIndexGroupData = childQuestionsGroup.findIndex(cqa => cqa.questionNo === childQuestionNumber);
        this.groupData[osGroup][group][subGroup]['questions'][childIndexGroupData]['hideQuestion'] = false;

      }

    }

  }
}





