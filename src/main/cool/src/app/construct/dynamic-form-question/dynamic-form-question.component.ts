import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OfferConstructService } from '@app/services/offer-construct.service';
import { BsDatepickerConfig, BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';


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
  @ViewChild('dp4') datepicker: BsDaterangepickerDirective;

  minDate: Date;
  constructor(public offerConstructService: OfferConstructService) {
  }
  ngOnInit() {
    this.minDate = new Date();
  }
  dateFormat(val){
    if(val!==''){
      try{
        return moment(val).format('DD-MMM-YYYY');
      }catch(err){}
    }
  }
  updateDate(e){
    if(e!==''){
      try{
        return moment(e).toISOString();
      }catch(err){}
    }
  }

}
