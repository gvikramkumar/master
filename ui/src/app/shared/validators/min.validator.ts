import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators} from '@angular/forms';

export function minValidator(min: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const val = Number(control.value);
    return val !== NaN && val < min ?
      {'min': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[dkMin]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinValidator, multi: true}]
})
export class MinValidator implements Validator {
  @Input() min: string;

  constructor() {
    const i = 5;
  }

  validate(control: AbstractControl): { [key: string]: any } {
    return Number(this.min) !== NaN ? minValidator(Number(Number(this.min)))(control)
      : null;
  }
}
