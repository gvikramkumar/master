import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {StoreBase} from "./store-base";
import {Subject} from "rxjs/Subject";
import {ObservableMedia} from "@angular/flex-layout";
import {StoreUser} from "./store-user";
import "rxjs/add/operator/first";

@Injectable()
/**
 * Store
 * @desc - inspired by redux, a global state pub/sub for state that needs to be global, not the kitchen sink.
 * Granular pub/sub so we don't have things being updated whenever anything changes, you can scope your updates
 * to the section change of interest. Not entirely applicable to this app (any user or contact change affects all),
 * but you get the point: don't update contact counts list when all you did was open the left nav.
 */
export class Store extends StoreBase {
  store$ = new BehaviorSubject<Store>(this);
  sub = this.store$.subscribe.bind(this.store$);
  usr: StoreUser;

  authenticated = false;
  initialized = false;
  leftNavClosed = false;
  initialBreakpoint: string;

  // localized pub/sub to keep work related to specific changes. Could use subPath for this as well, but this is cleaner
  // note that some are subjects, these are akin to messages, in that we don't care about a current value
  // we just want to know when an event happens
  updateLabelCounts$ = new Subject();
  subUpdateLabelCounts = this.updateLabelCounts$.subscribe.bind(this.updateLabelCounts$);
  leftNavClosed$ = new BehaviorSubject<boolean>(false);
  subLeftNavClosed = this.leftNavClosed$.subscribe.bind(this.leftNavClosed$);
  authenticated$ = new BehaviorSubject<boolean>(this.authenticated);
  subAuthenticated = this.authenticated$.subscribe.bind(this.authenticated$);
  initialized$ = new BehaviorSubject<boolean>(this.initialized);
  subInitialized = this.initialized$.subscribe.bind(this.initialized$);

  constructor(private media: ObservableMedia) {
    super();
    this.init();
    this.pub();
  }

  pub() {
    this.store$.next(this);
    super.pub();
  }

  init() {
    this.store = this;
    this.usr = new StoreUser(this);

    this.media.asObservable()
      .first()
      .subscribe(change => {
        this.initialBreakpoint = change.mqAlias;
      });
  }

  pubLeftNavClosed(val) {
    this.leftNavClosed = val;
    this.leftNavClosed$.next(this.leftNavClosed);
    this.pub();
  }

  pubUpdateLabelCounts() {
    this.updateLabelCounts$.next();
  }

  pubAuthenticated(val) {
    this.authenticated = val;
    this.authenticated$.next(this.authenticated);
    this.pub();
  }

  pubInitialized(val) {
    this.initialized = val;
    this.initialized$.next(this.initialized);
    this.pub();
  }

}
