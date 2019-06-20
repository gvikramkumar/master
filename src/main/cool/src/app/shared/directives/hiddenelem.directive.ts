import { Directive, OnInit, ElementRef, Input } from '@angular/core';
import { AccessManagementService } from '@app/services/access-management.service';

@Directive({
  selector: '[appHiddenelem]'
})
export class HiddenelemDirective implements OnInit {

  @Input() DirectiveValue: string;
  constructor(private el: ElementRef, private accesMgmtServ: AccessManagementService) { }

  ngOnInit() {

    this.accesMgmtServ.getRoleObj
      .subscribe((obj) => {
        const readOnlyProps = [];
        for (const item in obj) {
          if (obj[item] === 'READ') {
            readOnlyProps.push(item)
          }
        }
        if (readOnlyProps.indexOf(this.DirectiveValue) !== -1) {
          this.el.nativeElement.style.visibility = 'hidden';
        } else {
          this.el.nativeElement.style.visibility = 'visible';
        }
      });

    this.accesMgmtServ.getRoleObjFromUserRegistration
      .subscribe((obj) => {
        if (obj !== null) {
          const readOnlyProps = [];
          for (const item in obj) {
            if (obj[item] === 'READ') {
              readOnlyProps.push(item)
            }
          }
          if (readOnlyProps.indexOf(this.DirectiveValue) !== -1) {
            this.el.nativeElement.style.visibility = 'hidden';
          } else {
            this.el.nativeElement.style.visibility = 'visible';
          }
        }
      })
  }
}