import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators} from '@angular/forms';

export function forbiddenNameValidator(name: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    return control.value === name ? {'forbiddenName': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[dkForbiddenName]',
  providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenNameValidator, multi: true}]
})
export class ForbiddenNameValidator implements Validator {
  @Input() forbiddenName: string;

  constructor() {
    const i = 5;
  }


  validate(control: AbstractControl): { [key: string]: any } {
    return this.forbiddenName ? forbiddenNameValidator(this.forbiddenName)(control)
      : null;
  }
}
