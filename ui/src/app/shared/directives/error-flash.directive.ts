import {Directive, ElementRef} from '@angular/core';
import {NgForm} from '@angular/forms';

@Directive({
  selector: '[finErrorFlash]'
})
export class ErrorFlashDirective {

  constructor(elemRef: ElementRef, form: NgForm) {
    const elem = elemRef.nativeElement;
    elem.addEventListener('click', e => {
      if (form.invalid) {
        elem.classList.add('error-flash')
        setTimeout(() => elem.classList.remove('error-flash'), 500);
      }
    });
  }



}
