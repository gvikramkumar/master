import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OfferConstructService } from '@app/services/offer-construct.service';
import { BsDatepickerConfig,BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';


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
  minDate: Date;
  constructor(public offerConstructService: OfferConstructService,private datePipe: DatePipe) {
  }
  ngOnInit() { 
    this.minDate = new Date();
  }
  dateFormat(val){
    if(val!==''){
      return this.datePipe.transform(new Date(val),'dd-MMM-yyyy');
    }
  }
  updateDate(e){
    if(e!==''){
      return this.datePipe.transform(new Date(e));
    }
  }
}
