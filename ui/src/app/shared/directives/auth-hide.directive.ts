import {AfterViewInit, Directive, ElementRef, Input, OnChanges, OnInit} from '@angular/core';
import {Store} from '../../store/store';

@Directive({
  selector: '[finAuthHide]'
})
export class AuthHideDirective implements OnInit  {
@Input('finAuthHide') roles;

  constructor(private store: Store, private elem: ElementRef) {
  }

  ngOnInit() {
    if (this.store.user.isAuthorized(this.roles)) {
      this.elem.nativeElement.classList.add('fin-auth-hide');
    }
  }
}
