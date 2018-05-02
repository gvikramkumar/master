import {ApplicationRef, Injectable, NgZone} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {environment} from '../../environments/environment';
import * as _ from 'lodash';
import {Message} from './models/message';
import {Messages} from './models/messages';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import {Observable} from 'rxjs/Observable';
import {Store} from './store';

export class StoreBase {
  logState = environment.logState;
  messages$ = new Subject<Message>();

  constructor(protected store?: Store) {
  }

  getVal(path: string) {
    return _.get(this, path);
  }

  setVal(path: string, val) {
    _.set(this, path, val);
    this.pub();
    return this;
  }

  deleteVal(path: string) {
    _.set(this, path, undefined);
    this.pub();
  }

  pub() {
    if (this.logState === true) {
      console.log(this.getPropertiesOnly(this));
    }
  }

  getPropertiesOnly(_obj) {
    const obj = Object.assign({}, _obj);
    for (const prop in obj) {
      if (typeof obj[prop] === 'function' || prop.indexOf('$') !== -1 || prop === 'media') {
        delete obj[prop];
      } else if (typeof obj[prop] === 'object' && _obj === this && _.includes(['usr', 'con'], prop)) {
        try {
          obj[prop] = this.getPropertiesOnly(obj[prop]);
        } catch (e) {
        }
      }
    }
    return obj;
  }

  // an example of messaging for less formal pub/sub (no methods or observables required), but the
  // formal way is clean and type safe, so stick with that. So easy to implement this with observables.
  emit(messageName: Messages, payload: any) {
    this.messages$.next({name: messageName, payload});
  }

  onMessage(messageName: Messages, callback: (message: Message) => void) {
    this.messages$.filter(message => message.name === messageName).subscribe(callback);
  }

  /*
    // generic pub/sub using path:
    // both of these work, either the sub or pub will create the behaviorSubject that drives it

    store.subPath<string>('mypath.one')
      .subscribe(x => console.log('new mypath.one', x));
    setTimeout(() => store.pubPath<string>('mypath.one', 'lala'));
    >> undefined, lala, lala (not sure why two instead of one)

    store.pubPath<string>('mypath.one', 'lala');
    setTimeout(() => {
      store.subPath<string>('mypath.one')
        .subscribe(x => console.log('new mypath.one', x));
    })
    >> lala (just one)
*/

  // These three are an attempt to simplify all the pub/sub observables into just pub/sub calls, next iteration
  // (or another branch) we should try to run on these only
  subPath<T>(path: string): Observable<T> {
    return this.getOrCreateSubject<T>(path, _.get(this, path), 'sub');
  }

  pubPath<T>(path: string, val: T) {
    _.set(this, path, val);
    const subject = this.getOrCreateSubject<T>(path, val, 'pub');
    subject.next(val);
    if (this.store) {
      this.store.pub();
    }
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
