import {AfterViewInit, Directive, ElementRef, Input, OnChanges, OnInit} from '@angular/core';
import {AppStore} from '../../app/app-store';

@Directive({
  selector: '[finAuth]'
})
export class AuthDirective implements OnInit  {
@Input('finAuth') roles;

  constructor(private store: AppStore, private elem: ElementRef) {
  }

  ngOnInit() {
    if (!this.store.user.isAuthorized(this.roles)) {
      this.elem.nativeElement.classList.add('fin-hide');
    }
  }

}
