import {Directive, Input} from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn, NG_ASYNC_VALIDATORS,
  NG_VALIDATORS, ValidationErrors,
  Validator,
  ValidatorFn,
  Validators
} from '@angular/forms';

export function asyncNotInListValidator(plist: Promise<string[]>): AsyncValidatorFn {
  return ((control: AbstractControl): Promise<ValidationErrors | null> => {
    return plist
      .then(list => {
        if (control.value && list.indexOf(control.value.toUpperCase()) === -1) {
          return {notInList: {value: control.value}};
        } else {
          return null;
        }
      });
  });
}

@Directive({
  selector: '[finAsyncNotInList]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: AsyncNotInListValidator, multi: true}]
})
export class AsyncNotInListValidator implements AsyncValidator {
  @Input() plist: Promise<string[]>;

  validate(control: AbstractControl): Promise<ValidationErrors | null> {
    return this.plist ? <any>asyncNotInListValidator(this.plist)(control)
      : Promise.resolve(null);
  }
}
