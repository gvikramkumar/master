import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {StoreBase} from '../../store/store-base';
import {Store} from '../../store/store';

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
