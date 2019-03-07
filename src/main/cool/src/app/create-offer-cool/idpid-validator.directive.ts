import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidationErrors } from '@angular/forms';
import { CreateOfferService } from '@shared/services';

@Directive({
  selector: '[appIdpidValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: IdpidValidatorDirective, multi: true }]
})
export class IdpidValidatorDirective extends CreateOfferService implements Validator {

  validate(control: AbstractControl) {
    const elementValue = control.value;

    if (elementValue == null || elementValue === undefined || elementValue === '') {
      return { 'customRequired': 'false' };
    } else {

      this.validateIdpid(elementValue).subscribe(data => {

        if (data === true) {
          return { 'customRequired': 'true' };
        } else {
          return { 'customRequired': 'false' };
        }

      });


    }

  }
}




