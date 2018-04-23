import {User} from './models/common/user';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Store} from './store';
import {StoreBase} from './store-base';

export class StoreUser extends StoreBase {

  constructor(public store: Store) {
    super(store);
  }

  usr$ = new BehaviorSubject<StoreUser>(this);
  sub = this.usr$.subscribe.bind(this.usr$);
  pub() {
    this.usr$.next(this);
    this.store.pub();
  }

  user: User;
  user$ = new BehaviorSubject<User>(this.user);
  subUser = this.user$.subscribe.bind(this.user$);
  pubUser(user: User) {
    this.user = user;
    this.user$.next(this.user);
    this.pub();
  }

}
