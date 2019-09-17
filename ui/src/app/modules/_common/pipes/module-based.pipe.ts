import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moduleBasedPipe'
})
export class moduleBasedPipe implements PipeTransform {
  // transform(value: any, args?: any): any {
  //     console.log(value+"-----------------------");
  //      // return value;
  //   //return this.sanitizer.bypassSecurityTrustHtml(value);
  //   //return value.filter(item => 1 === 1);
  //   return true;
  // }
  transform(items: any, args?: any): any {
    if (!items || !args) {
        return items;
    }
    return items === 4;
    // filter items array, items which match and return true will be
      // kept, false will be filtered out
      //return items.filter(item => item.title.indexOf(filter.title) !== -1);
  }

}
