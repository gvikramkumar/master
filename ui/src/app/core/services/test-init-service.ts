import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {tap, delay} from 'rxjs/operators';

@Injectable()
export class Init1 {
  get() {
    return of('one').pipe(
      tap(() => {
        // return console.log('init1');
      }),
      delay(0)
    )
  }
}

@Injectable()
export class Init2 {
  get() {
    return of('two').pipe(
      tap(() => {
        // return console.log('init2');
      }),
      delay(0)
    )
  }
}

@Injectable()
export class Init3 {
  get() {
    return of('three').pipe(
      tap(() => {
        // return console.log('init3');
      }),
      delay(0)
    )
  }
}

@Injectable()
export class Init4 {
  get() {
    return of('four').pipe(
      tap(() => {
        // return console.log('init4');
      }),
      delay(0)
    )
  }
}

@Injectable()
export class Init5 {
  get() {
    return of('five').pipe(
      tap(() => {
        // return console.log('init5');
      }),
      delay(0)
    )
  }
}



