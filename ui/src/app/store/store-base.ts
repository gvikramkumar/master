import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {environment} from '../../environments/environment';
import * as _ from 'lodash';
import {Message} from './models/message';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import {Observable} from 'rxjs/Observable';
import {Store} from './store';

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
