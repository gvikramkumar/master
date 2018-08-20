import {Directive, ElementRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UiUtil} from '../../core/services/ui-util';

@Directive({
  selector: '[finErrorFlash]'
})
export class ErrorFlashDirective {

  constructor(elemRef: ElementRef, form: NgForm) {
    const elem = elemRef.nativeElement;
    elem.addEventListener('click', e => {
      UiUtil.waitForAsyncValidations(form)
        .then(() => {
          if (form.invalid) {
            elem.classList.add('error-flash')
            setTimeout(() => elem.classList.remove('error-flash'), 500);
          }
        });
    });
  }



}
