import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators} from '@angular/forms';

export function notInListValidator(list: string[]): ValidatorFn {
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

@Directive({
  selector: '[finNotInList]',
  providers: [{provide: NG_VALIDATORS, useExisting: NotInListValidator, multi: true}]
})
export class NotInListValidator implements Validator {
  @Input() list: string[];

  validate(control: AbstractControl): { [key: string]: any } {
    console.log('validating');
    return this.list ? notInListValidator(this.list)(control)
      : null;
  }
}
