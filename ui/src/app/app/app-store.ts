import {Injectable} from '@angular/core';
import {Subject, BehaviorSubject} from 'rxjs';
import {StoreBase} from '../core/base-classes/store-base';
import {ObservableMedia} from '@angular/flex-layout';
import {CuiHeaderOptions, CuiToastComponent} from '@cisco-ngx/cui-components';
import {first} from 'rxjs/operators';
import * as _ from 'lodash';
import AnyObj from '../../../../shared/models/any-obj';
import {DfaModule} from '../modules/_common/models/module';
import {UiUtil} from '../core/services/ui-util';
import {uiConst} from '../core/models/ui-const';
import {BreakpointChange} from '../core/services/breakpoint.service';
import DfaUser from '../../../../shared/models/dfa-user';

/* tslint:disable:member-ordering*/

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
  initialBreakpoint: string;
  showSpinner = false;

  user: DfaUser = <any>{};
  user$ = new BehaviorSubject<DfaUser>(this.user);
  subUser = this.user$.subscribe.bind(this.user$);
  pubUser(val) {
    this.user = val;
    this.user$.next(this.user);
  }

  headerOptions = new CuiHeaderOptions({
    showBrandingLogo: true,
    brandingLink: 'https://cisco.com',
    brandingTitle: '',
    showMobileNav: true,
    title: 'Digitized Financial Allocations',
    username: this.user.fullName,
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

  authorized = false;
  authorized$ = new Subject<boolean>();
  pubAuthorized(val) {
    this.authorized = val;
    this.authorized$.next(val);
  }

  initialized = false;
  initialized$ = new Subject<boolean>();
  initializedP = this.initialized$.asObservable().toPromise();
  pubInitialized() {
    this.initialized = true;
    this.initialized$.next(true);
    this.initialized$.complete();
  }


  modules: DfaModule[] = [];
  nonAdminModules: DfaModule[] = [];
  adminModule: DfaModule;
  modules$ = new BehaviorSubject<DfaModule[]>(this.modules);
  subModules = this.modules$.subscribe.bind(this.modules$);
  pubModules(val) {
    this.modules = val;
    this.nonAdminModules = this.modules.filter(module => module.moduleId !== 99);
    this.adminModule = _.find(this.modules, {moduleId: 99});
    this.modules$.next(this.modules);
  }

  module: DfaModule;
  // a special function that "must" get a module, so errors if not there yet
  getRepoModule(endpointName): DfaModule {
    // need to know if people are accessing this before it's ready
    if (!this.module) {
      throw new Error(`repoModule doesn\'t exist for ${endpointName}`);
    }
    return this.module;
  }
  module$ = new BehaviorSubject<DfaModule>(undefined);
  subModule = this.module$.subscribe.bind(this.module$);
  pubModule(moduleId) {
    // if no module yet or it has changed, set it
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
  routeDataPub(routeData) {
    // clone isn't good enough here as it reuses the breadcrumb array, and we keep appending module name
    // to the same array.
    const data = _.cloneDeep(routeData);
    if (this.module && data.breadcrumbs && data.breadcrumbs.length > 0) {
      data.breadcrumbs.splice(1, 0, {label: this.module.name});
    }
    this.routeData$.next(data);
  }

  currentUrl$ = new BehaviorSubject('');
  currentUrlSub = this.currentUrl$.asObservable().subscribe.bind(this.currentUrl$);
  currentUrlPub(val) {
    this.currentUrl$.next(val);
  }

  /* tslint:enable:member-ordering*/

}
