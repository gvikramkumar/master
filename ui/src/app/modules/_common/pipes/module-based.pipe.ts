import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moduleBasedPipe'
})
export class moduleBasedPipe implements PipeTransform {
  transform(items: any, moduleId?: any): any {    
    return items.filter( item => {
      return item.moduleId === moduleId;
    });
  }
}
