import {Component, OnInit, ViewChild} from '@angular/core';
import {CuiInputComponent, CuiInputOptions} from '@cisco-ngx/cui-components';
import {AbstractControl, AsyncValidatorFn, NgForm, NgModel, ValidatorFn, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {UiUtil} from '../../../core/services/ui-util';
import {Observable, of} from 'rxjs';
import {notInListValidator} from '../../validators/not-in-list.validator';
import {asyncNotInListValidator} from '../../validators/async-not-in-list.validator';

class User {
  name = 'd';
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
  @ViewChild('ng_name2') ng_name2: NgModel;
  user = new User();
  genders = [
    {name: 'male', value: 1},
    {name: 'female', value: 2},
  ];
  nameOpts = new CuiInputOptions();
  nameOpts2 = new CuiInputOptions();
  list = ['THREE', 'FOUR'];

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

  ngAfterViewInit() {
/*
    this.ng_name2.control.setValidators([
      Validators.required,
      Validators.minLength(2)]);
      // notInListValidator(this.list)]);

    this.ng_name2.control.setAsyncValidators([asyncNotInListValidator(Promise.resolve(this.list))]);
*/
  }

  getList() {
    console.log('getlist');
    return Promise.resolve(this.list);
  }

  submit() {
    UiUtil.triggerBlur('.my-form');
    /*
        // this markes as touched but cui-input only listens to blur event so useless for cui-input. Would work for
        // other controls, but they can just use form.submitted, so why bother.
        _.forEach(this.form.controls, control => {
          control.markAsTouched();
        });
    */
  }

/*
  // these methods can go here or in a directive file. If only needed on this one page, then just put it
  // on the page.
  notInListValidator(list: string[]): ValidatorFn {
    return ((control: AbstractControl): {[key: string]: any} | null => {
      if (control.value && list.indexOf(control.value.toUpperCase()) === -1) {
        console.log('return error');
        return {'notInList': {value: control.value}};
      } else {
        console.log('return null');
        return null;
      }
    });
  }
*/

  blur() {
    console.log('blur tt');
  }

  reset() {

  }



}
