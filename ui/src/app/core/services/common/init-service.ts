import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';

@Injectable()
export class Init1 {
  get() {
    return Observable.of('one')
      .do(() => {
        // return console.log('init1');
      })
      .delay(0);
  }
}

@Injectable()
export class Init2 {
  get() {
    return Observable.of('two')
      .do(() => {
        // return console.log('init2');
      })
      .delay(0);
  }
}

@Injectable()
export class Init3 {
  get() {
    return Observable.of('three')
      .do(() => {
        // return console.log('init3');
      })
      .delay(0);
  }
}

@Injectable()
export class Init4 {
  get() {
    return Observable.of('four')
      .do(() => {
        // return console.log('init4');
      })
      .delay(0);
  }
}

@Injectable()
export class Init5 {
  get() {
    return Observable.of('five')
      .do(() => {
        // return console.log('init5');
      })
      .delay(0);
  }
}



