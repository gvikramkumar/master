import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators} from '@angular/forms';

export function numberValidator(): ValidatorFn {
  return ((control: AbstractControl): {[key: string]: any} | null => {
    if (control.value === undefined || control.value === null || (typeof control.value === 'string' && control.value.trim() === '')) {
      return null;
    } else {
      if (isNaN(Number(control.value))) {
        return {'isNumber': {value: control.value}};
      } else {
        return null;
      }
    }
  });
}

@Directive({
  selector: 'input[finIsNumber]',
  providers: [{provide: NG_VALIDATORS, useExisting: NumberValidator, multi: true}]
})
export class NumberValidator implements Validator {
  validate(control: AbstractControl): { [key: string]: any } {
    return numberValidator()(control);
  }
}

