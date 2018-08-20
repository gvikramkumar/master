import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators} from '@angular/forms';

export function notInListValidator(_list: string[], upper = true): ValidatorFn {
  return ((control: AbstractControl): {[key: string]: any} | null => {
    if (upper) {
      const list = _list.map(x => x.toUpperCase());
      if (control.value && list.indexOf(control.value.toUpperCase()) !== -1) {
        return {'notInList': {value: control.value}};
      } else {
        return null;
      }
    } else {
      const list = _list;
      if (control.value && list.indexOf(control.value) !== -1) {
        return {'notInList': {value: control.value}};
      } else {
        return null;
      }
    }
  });
}

@Directive({
  selector: 'input[finNotInList]',
  providers: [{provide: NG_VALIDATORS, useExisting: NotInListValidator, multi: true}]
})
export class NotInListValidator implements Validator {
  @Input('finNotInList') list: string[];
  @Input() finNotInListProperty: string;

  validate(control: AbstractControl): { [key: string]: any } {
    return this.list ? notInListValidator(this.list)(control)
      : null;
  }
}

