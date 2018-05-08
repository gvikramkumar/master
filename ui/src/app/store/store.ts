import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {StoreBase} from "./store-base";
import {ObservableMedia} from "@angular/flex-layout";
import "rxjs/add/operator/first";
import {CuiHeaderOptions} from '@cisco-ngx/cui-components';
import {Router} from '@angular/router';
import {User} from './models/user';

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
  user = new User('jodoe', 'John Doe', []);


  // pft: StoreProfitability; //todo: these substores will be isolated from main store??
  // need to figure this out, these modules may or may not exist, they should have their own store
  // but also use main store for inter-module communication
  pub() {
    this.store$.next(this);
    super.pub();
  }

  authenticated = false;
  initialized = false;
  leftNavClosed = false;
  initialBreakpoint: string;
  modules = [];

  authenticated$ = new BehaviorSubject<boolean>(this.authenticated);
  subAuthenticated = this.authenticated$.subscribe.bind(this.authenticated$);
  initialized$ = new BehaviorSubject<boolean>(this.initialized);
  subInitialized = this.initialized$.subscribe.bind(this.initialized$);
  leftNavClosed$ = new BehaviorSubject<boolean>(false);
  subLeftNavClosed = this.leftNavClosed$.subscribe.bind(this.leftNavClosed$);
  routeData$ = new BehaviorSubject({hero: {}, breadcrumbs:[]});
  routeDataSub = this.routeData$.asObservable().subscribe.bind(this.routeData$);
  currentUrl$ = new BehaviorSubject('');
  currentUrlSub = this.currentUrl$.asObservable().subscribe.bind(this.currentUrl$);

  headerOptionsBase = new CuiHeaderOptions({
    "showBrandingLogo": true,
    "brandingLink": "https://cisco.com",
    "brandingTitle": "",
    "showMobileNav": true,
    "title": "Digitized Financial Allocations",
    "username": this.user.name,
  });


  constructor(private media: ObservableMedia, private router: Router) {
    super();
    this.init();
    this.pub();
  }

  init() {
    this.store = this;
    // this.pft = new StoreProfitability(this);

    this.media.asObservable()
      .first()
      .subscribe(change => {
        this.initialBreakpoint = change.mqAlias;
      });
  }

  currentUrlPub(val) {
    this.currentUrl$.next(val);
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
