import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {StoreBase} from '../core/base-classes/store-base';
import {CuiHeaderOptions} from '@cisco-ngx/cui-components';
import {first} from 'rxjs/operators';
import _ from 'lodash';
import {DfaModule} from '../modules/_common/models/module';
import DfaUser from '../../../../shared/models/dfa-user';
import {shUtil} from '../../../../shared/misc/shared-util';
import {Location} from '@angular/common';

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
  env: string;
  location: Location;
  mainCompDataLoad = false;
  showSpinner = false;


  isLocalEnv() {
    return _.includes(['dev', 'ldev'], this.env) || this.isUnitEnv();
  }
  isUnitEnv() {
    return _.includes(['unitdev', 'unitsdev', 'unitstage'], this.env);
  }
  isDevEnv() {
    return this.env === 'sdev';
  }
  isStageEnv() {
    return this.env === 'stage';
  }
  isProdEnv() {
    return this.env === 'prod';
  }

  showProgress$: Subject<boolean> = new Subject();
  showProgressBar(val = true) {
    this.showProgress$.next(val);
  }
  hideProgressBar() {
    this.showProgress$.next(false);
  }

  user: DfaUser;
  user$ = new Subject<DfaUser>();
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
    username: '',
  });


  constructor() {
    super();
    this.init();
  }

  init() {
/*
    this.mediaObserver.media$
      .pipe(first())
      .subscribe(change => {
        this.initialBreakpoint = change.mqAlias;
      });
*/
    this.subUser((user => {
      this.headerOptions.username = user.fullName;
      if (this.isLocalEnv() && user.roles[0]) {
        let role;
        if (user.roles[0].indexOf(':') !== -1) {
          role = user.roles[0].substr(user.roles[0].indexOf(':') + 1);
        } else {
          role = user.roles[0];
        }
        this.headerOptions.username += ` - ${role}`;
      }
      // this.headerOptions = Object.assign({}, this.headerOptions);
    }).bind(this));
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
  pubModules(_modules) {
    this.modules = _modules;
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
  getNonAdminModuleId() {
    const moduleId = this.module && this.module.moduleId;
    if (!moduleId) {
      throw new Error(`No moduleId`);
    }
    if (shUtil.isAdminModuleId(moduleId)) {
      throw new Error(`No moduleId for itadmin call.`);
    }
    return moduleId;
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
