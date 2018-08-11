import {Component, OnInit, ViewChild} from '@angular/core';
import {CuiInputOptions} from '@cisco-ngx/cui-components';
import {NgForm} from '@angular/forms';
import * as _ from 'lodash';
import {UiUtil} from '../../../core/services/ui-util';

class User {
  name: string;
  name2: string;
  age?: number;
  gender: 1 | 2;
}

@Component({
  selector: 'fin-test-validation',
  templateUrl: './test-validation.component.html',
  styleUrls: ['./test-validation.component.scss']
})
export class TestValidationComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  user = new User();
  genders = [
    {name: 'male', value: 1},
    {name: 'female', value: 2},
  ];
  nameOpts = new CuiInputOptions();
  nameOpts2 = new CuiInputOptions();




  constructor() {
    this.nameOpts.maxLength = 3;
    this.nameOpts.required = true;

    this.nameOpts2.minLength = 2;

    /*
    this.nameOpts.errorMessages.push(		{
        type: CuiInputValidationError.MAX_LENGTH_EXCEEDED,
        message: (): string => `Maxmimum of ${this.nameOpts.maxLength} characters allowed.`,
      });
*/
  }

  ngOnInit() {
  }

  blur() {
    console.log('myflug')
  }

  submit() {
    UiUtil.triggerBlur('.my-form');
  }

  reset() {

  }


}
