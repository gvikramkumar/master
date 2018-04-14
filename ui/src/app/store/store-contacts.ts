import {Contact} from './models/contact';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Store} from './store';
import {StoreBase} from './store-base';
import {Subject} from 'rxjs/Subject';

export class StoreContacts extends StoreBase {
  con$ = new BehaviorSubject<StoreContacts>(this);
  sub = this.con$.subscribe.bind(this.con$);
  contacts: Contact[] = [];

  contacts$ = new BehaviorSubject<Contact[]>(this.contacts);
  subContacts = this.contacts$.subscribe.bind(this.contacts$);
  openDetail$ = new Subject<Contact>();
  subOpenDetail = this.openDetail$.subscribe.bind(this.openDetail$);

  constructor(public store: Store) {
    super(store);
  }

  pub() {
    this.con$.next(this);
    this.store.pub();
  }

  pubContacts(contacts: Contact[]) {
    this.contacts = contacts;
    this.contacts$.next(this.contacts);
    this.pub();
    this.store.pubUpdateLabelCounts();
  }

  pubOpenDetail(contact: Contact) {
    this.openDetail$.next(contact);
  }

}
