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

export function asyncNotInListValidator(methodName: string): AsyncValidatorFn {
  return ((control: AbstractControl): Promise<ValidationErrors | null> => {
    let promise;
    switch (methodName) {
      case 'mylist':
        console.log('getting mylist');
        promise = Promise.resolve(['ONE', 'TWO']);
        break;
    }
    return promise
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
  @Input('finAsyncNotInList') methodName: string;

  validate(control: AbstractControl): Promise<ValidationErrors | null> {
    return this.methodName ? <any>asyncNotInListValidator(this.methodName)(control)
      : Promise.resolve(null);
  }
}
