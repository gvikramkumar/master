import { Directive } from '@angular/core';
import { Validator, ValidatorFn, AbstractControl, NG_VALIDATORS } from '@angular/forms';

import * as _ from 'lodash';

@Directive({
  selector: '[appCustomRangeValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CustomRangeValidatorDirective, multi: true }]
  // 
})
export class CustomRangeValidatorDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl) {

    const elementValue = control.value;

    const reg = new RegExp('^[0-9]{1,5}(\.[0-9]{2})?$');

    if (!reg.test(elementValue)) {
      return { 'cus_pattern': 'Value should be 5 digit number' };
    }

    return null;
  }

}
