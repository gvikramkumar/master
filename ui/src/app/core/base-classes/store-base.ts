import {BehaviorSubject, Observable} from 'rxjs';
import * as _ from 'lodash';

export class StoreBase {

  constructor() {
  }

  getVal(path: string) {
    return _.get(this, path);
  }

  // how does this publish?
  setVal(path: string, val) {
    _.set(this, path, val);
    return this;
  }

  deleteVal(path: string) {
    _.set(this, path, undefined);
  }

  // These three are an attempt to simplify all the pub/sub observables into just pub/sub
  subPath<T>(path: string): Observable<T> {
    return this.getOrCreateSubject<T>(path, _.get(this, path), 'sub');
  }

  pubPath<T>(path: string, val: T) {
    _.set(this, path, val);
    const subject = this.getOrCreateSubject<T>(path, val, 'pub');
    subject.next(val);
  }

  getOrCreateSubject<T>(path, val, mode) {
    const varName = path + '$';
    if (!this[varName]) {
      this[varName] = new BehaviorSubject<T>(val);
    } else if (mode === 'pub') {
      this[varName].next(val);
    }
    return this[varName];
  }

}
