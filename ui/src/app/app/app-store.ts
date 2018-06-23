import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {StoreBase} from '../core/base-classes/store-base';
import {ObservableMedia} from '@angular/flex-layout';
import {CuiHeaderOptions, CuiToastComponent} from '@cisco-ngx/cui-components';
import {User} from '../dfa-common/models/user';
import {first} from 'rxjs/operators';
import {Module} from '../dfa-common/models/module';
import * as _ from 'lodash';
import AnyObj from '../core/models/any-obj';
import {Subject} from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
/**
 * AppStore
 * @desc - global variables, these come in different flavors: property, observable, or property and observable
 * the observables come in 2 flavors: subject (returns value only on pub) or behaviorSubject
 * (has initial value so always returns last value on subscribe)
 */
export class AppStore extends StoreBase {
  user = new User('jodoe', 'John Doe', []);
  initialBreakpoint: string;
  modules = [];
  showSpinner = false;
  currentModule: Module;
  headerOptions = new CuiHeaderOptions({
    'showBrandingLogo': true,
    'brandingLink': 'https://cisco.com',
    'brandingTitle': '',
    'showMobileNav': true,
    'title': 'Digitized Financial Allocations',
    'username': this.user.name,
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

  /* tslint:disable:member-ordering*/
  authenticated = false;
  authenticated$ = new BehaviorSubject<boolean>(this.authenticated);
  subAuthenticated = this.authenticated$.subscribe.bind(this.authenticated$);
  pubAuthenticated(val) {
    this.authenticated = val;
    this.authenticated$.next(this.authenticated);
  }

  initialized = false;
  initialized$ = new BehaviorSubject<boolean>(this.initialized);
  subInitialized = this.initialized$.subscribe.bind(this.initialized$);
  pubInitialized(val) {
    this.initialized = val;
    this.initialized$.next(this.initialized);
  }

  module: Module;
  module$ = new Subject<Module>();
  subModule = this.module$.subscribe.bind(this.module$);
  pubModule(moduleId) {
    if (!this.module || this.module.moduleId !== moduleId) {
      const module = _.find(this.modules, {moduleId});
      if (module) {
        this.module = module;
        this.module$.next(this.module);
        // console.log('>>>>>>>> module update', this.module.name);
      } else {
        console.error(`No module found for moduleId: ${moduleId}`);
      }
    }
  }

  leftNavClosed = false;
  leftNavClosed$ = new BehaviorSubject<boolean>(false);
  subLeftNavClosed = this.leftNavClosed$.subscribe.bind(this.leftNavClosed$);
  pubLeftNavClosed(val) {
    this.leftNavClosed = val;
    this.leftNavClosed$.next(this.leftNavClosed);
  }

  routeData$ = new BehaviorSubject({hero: {}, breadcrumbs:[]});
  routeDataSub = this.routeData$.asObservable().subscribe.bind(this.routeData$);
  routeDataPub(val) {
    this.routeData$.next(val);
  }

  currentUrl$ = new BehaviorSubject('');
  currentUrlSub = this.currentUrl$.asObservable().subscribe.bind(this.currentUrl$);
  currentUrlPub(val) {
    this.currentUrl$.next(val);
  }

  updateModule(moduleId) {
    if (!this.module || this.module.moduleId !== moduleId) {
      const module = _.find(this.modules, {moduleId});
      if (!module) {
        console.error(`No module found for moduleId: ${moduleId}`);
      }
      this.module = module;
      // console.log('>>>>>>>> module update', this.module.name);
    }
  }

  /* tslint:enable:member-ordering*/

}
