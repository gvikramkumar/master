import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {StoreBase} from "./store-base";
import {ObservableMedia} from "@angular/flex-layout";
import {CuiHeaderOptions, CuiToastComponent} from '@cisco-ngx/cui-components';
import {User} from './models/user';
import {first} from 'rxjs/operators';

@Injectable()
/**
 * Store
 * @desc - inspired by redux, a global state pub/sub for state that needs to be global, not the kitchen sink.
 * Granular pub/sub so we don't have things being updated whenever anything changes, you can scope your updates
 * to the section change of interest. Not entirely applicable to this app (any user or contact change affects all),
 * but you get the point: don't update contact counts list when all you did was open the left nav.
 */
export class Store extends StoreBase {
  user = new User('jodoe', 'John Doe', []);

  authenticated = false;
  initialized = false;
  leftNavClosed = false;
  initialBreakpoint: string;
  modules = [];
  showSpinner = false;

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
  permToast: CuiToastComponent;
  autoHideToast: CuiToastComponent;

  headerOptionsBase = new CuiHeaderOptions({
    "showBrandingLogo": true,
    "brandingLink": "https://cisco.com",
    "brandingTitle": "",
    "showMobileNav": true,
    "title": "Digitized Financial Allocations",
    "username": this.user.name,
  });


  constructor(private media: ObservableMedia) {
    super();
    this.init();
  }

  init() {
    this.media.asObservable()
      .pipe(first())
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
  }

  pubAuthenticated(val) {
    this.authenticated = val;
    this.authenticated$.next(this.authenticated);
  }

  pubInitialized(val) {
    this.initialized = val;
    this.initialized$.next(this.initialized);
  }

}
