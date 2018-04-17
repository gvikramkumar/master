import {User} from './models/user';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Store} from './store';
import {StoreBase} from './store-base';

export class StoreProfitability extends StoreBase {

  constructor(public store: Store) {
    super(store);
  }

  pft$ = new BehaviorSubject<StoreProfitability>(this);
  sub = this.pft$.subscribe.bind(this.pft$);
  pub() {
    this.pft$.next(this);
    this.store.pub();
  }

}
