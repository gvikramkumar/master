import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators} from '@angular/forms';

export function inListValidator(_list: string[], upper = true): ValidatorFn {
  return ((control: AbstractControl): {[key: string]: any} | null => {
    if (control.value === undefined || control.value === null || (typeof control.value === 'string' && control.value.trim() === '')) {
      return null;
    } else if (!_list.length) {
      console.error('inList: list is empty');
      return {'inList': {value: control.value}};
    }
    let isNumberList = false;
    if (typeof _list[0] === 'number') {
      isNumberList = true;
    }
    if (upper && !isNumberList) {
      const list = _list.map(x => x.toUpperCase());
      if (list.indexOf(control.value.toUpperCase()) === -1) {
        return {'inList': {value: control.value}};
      } else {
        return null;
      }
    } else {
      const list = _list;
      const value = isNumberList ? Number(control.value) : control.value;
      if (isNaN(value)) {
        console.error('inList: value is not a number', control.value);
        return {'inList': {value: control.value}};
      }
      if (list.indexOf(value) === -1) {
        return {'inList': {value: control.value}};
      } else {
        return null;
      }
    }
  });
}

@Directive({
  selector: 'input[finInList]',
  providers: [{provide: NG_VALIDATORS, useExisting: InListValidator, multi: true}]
})
export class InListValidator implements Validator {
  @Input('finInList') list: string[];

  validate(control: AbstractControl): { [key: string]: any } {
    return this.list ? inListValidator(this.list)(control) : null;
  }
}

