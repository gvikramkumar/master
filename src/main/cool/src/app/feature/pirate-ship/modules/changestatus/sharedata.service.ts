import { Injectable } from '@angular/core';  
import { Subject } from 'rxjs';  
import { Observable } from 'rxjs'
@Injectable()
export class SharedataService {
  private subject = new Subject<any>();
  constructor() { }

  setModuleDetails(data: any) {
    this.subject.next(data);
  }

  getModuleDetails(): Observable<any> {
    return this.subject.asObservable();
  }

}
