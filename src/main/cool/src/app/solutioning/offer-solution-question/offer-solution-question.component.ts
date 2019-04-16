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

  minDate: Date;
  caseId: string;
  inValidDate = false;
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
    this.minDate = new Date();
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });
  }

  formatFreeTextWithNoSpaceInput(answer: string, question: any): any {

    let splitAnswer: string[] = answer.split(',');

    splitAnswer = splitAnswer.reduce((acc, val) => {
      val = val.replace(/\s+/g, ' ').trim();
      acc.push(val);
      return acc;
    }, []);

    let firstTime = true;
    let concatAnswer = '';

    splitAnswer.map(splitWord => {
      if (firstTime) {
        concatAnswer = splitWord;
        firstTime = false;
      } else {
        concatAnswer = concatAnswer + ', ' + splitWord;
      }
    });

    question['answerToQuestion'] = concatAnswer;
    return question;

  }

  validateDate(date: any, question: any) {

    question['inValidDate'] = false;
    const group = question['group'];
    const osGroup = question['oSgroup'];
    const subGroup = question['subGroup'];

    const parentIndex = this.groupData[osGroup][group][subGroup]['questions']
      .findIndex(qna => qna.question === 'Announcement Start Date: ');
    let parentDate = this.groupData[osGroup][group][subGroup]['questions'][parentIndex]['answerToQuestion'];

    const childIndex = this.groupData[osGroup][group][subGroup]['questions']
      .findIndex(qna => qna.question === 'Announcement End Date: ');
    let childDate = this.groupData[osGroup][group][subGroup]['questions'][childIndex]['answerToQuestion'];


    if (question['question'] === 'Announcement Start Date: ') {
      parentDate = date;
    } else {
      childDate = date;
    }

    parentDate = new Date(moment(parentDate).format('YYYY-MM-DD'));
    childDate = new Date(moment(childDate).format('YYYY-MM-DD'));

    const diffInDays = Math.ceil((childDate.valueOf() - parentDate.valueOf()) / (1000 * 3600 * 24));

    if (diffInDays > 180 || (parentDate > childDate)) {
      this.inValidDate = true;
      question['inValidDate'] = true;
    }

  }

  showHiddenQuestionBasedOnUserInput(selectedValue: string, question: any) {

    if (selectedValue !== '') {

      if (question['questionType'] === 'Date') {
        this.validateDate(selectedValue, question);
      } else if (question['questionType'] === 'Free Text with No Space') {
        question = this.formatFreeTextWithNoSpaceInput(selectedValue, question);
      }

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


        if ((question['questionType'] === 'Radio Button' || question['questionType'] === 'dropdown')
          && (selectedValue === 'No' || selectedValue === 'N/A')) {
          this.groupData[osGroup][group][subGroup]['questions'][childIndexGroupData]['hideQuestion'] = true;
          this.groupData[osGroup][group][subGroup]['questions'][childIndexGroupData]['answerToQuestion'] = 'N/A';
          this.groupData[osGroup][group][subGroup]['questions'][childIndexGroupData]['rules']['isMandatoryOptional'] = '';
          this.showHiddenQuestionBasedOnUserInput('N/A', this.groupData[osGroup][group][subGroup]['questions'][childIndexGroupData]);
        } else {
          this.groupData[osGroup][group][subGroup]['questions'][childIndexGroupData]['hideQuestion'] = false;
          this.groupData[osGroup][group][subGroup]['questions'][childIndexGroupData]['rules']['isMandatoryOptional'] = 'Mandatory';
        }

      }

    }

  }
}





