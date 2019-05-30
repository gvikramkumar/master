import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators} from '@angular/forms';

export function notInListValidator(_list: string[], upper = true): ValidatorFn {
  return ((control: AbstractControl): {[key: string]: any} | null => {
    if (control.value === undefined || control.value === null || (typeof control.value === 'string' && control.value.trim() === '')) {
      return null;
    } else if (!_list.length) {
      return null;
    }
    let isNumberList = false;
    if (typeof _list[0] === 'number') {
      isNumberList = true;
    }
    if (upper && !isNumberList) {
      const list = _list.map(x => x.toUpperCase());
      if (list.indexOf(control.value.toUpperCase()) !== -1) {
        return {'notInList': {value: control.value}};
      } else {
        return null;
      }
    } else {
      const list = _list;
      const value = isNumberList ? Number(control.value) : control.value;
      if (list.indexOf(value) !== -1) {
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
    return this.list ? notInListValidator(this.list)(control) : null;
  }
}

