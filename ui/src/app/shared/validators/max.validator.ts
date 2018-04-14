import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators} from '@angular/forms';

export function maxValidator(max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const val = Number(control.value);
    return val !== NaN && val > max ?
      {'max': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[dkMax]',
  providers: [{provide: NG_VALIDATORS, useExisting: MaxValidator, multi: true}]
})
export class MaxValidator implements Validator {
  @Input() max: string;

  constructor() {
    const i = 5;
  }

  validate(control: AbstractControl): { [key: string]: any } {
    return Number(this.max) !== NaN ? maxValidator(Number(Number(this.max)))(control)
      : null;
  }
}
