import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators} from '@angular/forms';

export function inListValidator(_list: string[], upper = true): ValidatorFn {
  return ((control: AbstractControl): {[key: string]: any} | null => {
    const list = _list.map(x => x.toUpperCase());
    if (upper && control.value && list.indexOf(control.value.toUpperCase()) === -1) {
      return {'inList': {value: control.value}};
    } else if (control.value && list.indexOf(control.value) === -1) {
      return {'inList': {value: control.value}};
    } else {
      return null;
    }
  });
}

@Directive({
  selector: '[finInList]',
  providers: [{provide: NG_VALIDATORS, useExisting: InListValidator, multi: true}]
})
export class InListValidator implements Validator {
  @Input() list: string[];

  validate(control: AbstractControl): { [key: string]: any } {
    return this.list ? inListValidator(this.list)(control)
      : null;
  }
}

