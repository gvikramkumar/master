import { Directive, ElementRef, Input } from '@angular/core';
import { AccessManagementService } from '@app/services/access-management.service';

@Directive({
  selector: '[appReadonly]'
})
export class ReadonlyDirective {

  @Input() DirectiveValue: string;

  constructor(private el: ElementRef, private accesMgmtServ: AccessManagementService) { }

  ngOnInit() {

    this.accesMgmtServ.getRoleObj
      .subscribe((obj) => {
        let readOnlyProps = [];
        for (let item in obj) {
          if (obj[item] === "READ") {
            readOnlyProps.push(item)
          }
        }
        if (readOnlyProps.indexOf(this.DirectiveValue) !== -1) {
          this.el.nativeElement.style.pointerEvents = "none";
        } else {
          this.el.nativeElement.style.pointerEvents = "all";
        }
      });

    this.accesMgmtServ.getRoleObjFromUserRegistration
      .subscribe((obj) => {
        if (obj !== null) {
          let readOnlyProps = [];
          for (let item in obj) {
            if (obj[item] === "READ") {
              readOnlyProps.push(item)
            }
          }
          if (readOnlyProps.indexOf(this.DirectiveValue) !== -1) {
            this.el.nativeElement.style.pointerEvents = "none";
          } else {
            this.el.nativeElement.style.pointerEvents = "all";
          }
        }
      })
  }
}