import {AfterViewInit, Directive, ElementRef, Input, OnChanges, OnInit} from '@angular/core';
import {AppStore} from '../../app/app-store';

@Directive({
  selector: '[finAuthOnly]'
})
export class AuthOnlyDirective implements OnInit  {
@Input('finAuthOnly') roles;

  constructor(private store: AppStore, private elem: ElementRef) {
  }

  ngOnInit() {
    if (!this.store.user.isAuthorizedOnly(this.roles)) {
      this.elem.nativeElement.classList.add('fin-hide');
    }
  }

}
