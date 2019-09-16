import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moduleBasedPipe'
})
export class moduleBasedPipe implements PipeTransform {
  transform(value: any, args?: any): any {
      console.log(value+"-----------------------");
       // return value;
    //return this.sanitizer.bypassSecurityTrustHtml(value);
    //return value.filter(item => 1 === 1);
    return true;
  }

}
