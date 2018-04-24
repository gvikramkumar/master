import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {StoreBase} from "./store-base";
import {Subject} from "rxjs/Subject";
import {ObservableMedia} from "@angular/flex-layout";
import {StoreUser} from "./store-user";
import "rxjs/add/operator/first";
import {StoreProfitability} from './store-profitability';
import {CuiHeaderOptions} from '@cisco-ngx/cui-components';
import {NavigationEnd, Router} from '@angular/router';

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
  pft: StoreProfitability;
  pub() {
    this.store$.next(this);
    super.pub();
  }

  authenticated = false;
  initialized = false;
  leftNavClosed = false;
  initialBreakpoint: string;
  modules = [];
  user = {
    displayName: 'John Doe',
    userName: 'jodoe'
  }

  authenticated$ = new BehaviorSubject<boolean>(this.authenticated);
  subAuthenticated = this.authenticated$.subscribe.bind(this.authenticated$);
  initialized$ = new BehaviorSubject<boolean>(this.initialized);
  subInitialized = this.initialized$.subscribe.bind(this.initialized$);
  leftNavClosed$ = new BehaviorSubject<boolean>(false);
  subLeftNavClosed = this.leftNavClosed$.subscribe.bind(this.leftNavClosed$);
  routeData$ = new Subject();
  routeDataSub = this.routeData$.asObservable().subscribe.bind(this.routeData$);

  headerOptions = new CuiHeaderOptions({
    "showBrandingLogo": true,
    "brandingLink": "https://cisco.com",
    "brandingTitle": "",
    "showMobileNav": true,
    "title": "Digitized Financial Allocations",
    "username": this.user.displayName,
  });


  constructor(private media: ObservableMedia, private router: Router) {
    super();
    this.init();
    this.pub();
  }

  init() {
    this.store = this;
    this.usr = new StoreUser(this);
    this.pft = new StoreProfitability(this);

    this.media.asObservable()
      .first()
      .subscribe(change => {
        this.initialBreakpoint = change.mqAlias;
      });
  }

  routeDataPub(val) {
    this.routeData$.next(val);
  }

  pubLeftNavClosed(val) {
    this.leftNavClosed = val;
    this.leftNavClosed$.next(this.leftNavClosed);
    this.pub();
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
