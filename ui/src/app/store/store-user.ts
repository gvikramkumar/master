import {User} from './models/user';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Store} from './store';
import {StoreBase} from './store-base';

export class StoreUser extends StoreBase {
  usr$ = new BehaviorSubject<StoreUser>(this);
  sub = this.usr$.subscribe.bind(this.usr$);
  user: User;

  user$ = new BehaviorSubject<User>(this.user);
  subUser = this.user$.subscribe.bind(this.user$);

  constructor(public store: Store) {
    super(store);
  }

  pub() {
    this.usr$.next(this);
    this.store.pub();
  }

  pubUser(user: User) {
    this.user = user;
    this.user$.next(this.user);
    this.pub();
  }

}
