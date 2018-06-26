import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {StoreBase} from '../core/base-classes/store-base';
import {ObservableMedia} from '@angular/flex-layout';
import {CuiHeaderOptions, CuiToastComponent} from '@cisco-ngx/cui-components';
import {first} from 'rxjs/operators';
import * as _ from 'lodash';
import AnyObj from '../../../../shared/models/any-obj';
import {Subject} from 'rxjs/Subject';
import {DfaModule} from '../modules/_common/models/module';
import {User} from '../modules/_common/models/user';


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
  currentModule: DfaModule;
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

  displayModule: DfaModule;
  displayModule$ = new BehaviorSubject<DfaModule>(undefined);
  subDisplayModule = this.displayModule$.subscribe.bind(this.displayModule$);
  pubDisplayModule(moduleId) {
    // if no module yet or it has changed, set it
    if (!this.displayModule || this.displayModule.moduleId !== moduleId) {
      const module = _.find(this.modules, {moduleId});
      if (module) {
        this.displayModule = module;
        this.displayModule$.next(this.displayModule);
        // console.log('>>>>>>>> displayModule update', this.displayModule.name);
      } else {
        console.error(`No displayModule found for moduleId: ${moduleId}`);
      }
    }
  }

  private _repoModule: DfaModule;
  get repoModuleId() {
    return this.repoModule.moduleId;
  }
  get repoModule(): DfaModule {
    // need to know if people are accessing this before it's ready
    if (!this._repoModule) {
      throw new Error('store.repoModule doesn\'t exist');
    }
    return this._repoModule;
  }
  set repoModule(module) {
    this._repoModule = module;
  }
  repoModule$ = new BehaviorSubject<DfaModule>(undefined);
  subRepoModule = this.repoModule$.subscribe.bind(this.repoModule$);
  pubRepoModule(moduleId) {
    // if no module yet or it has changed, set it
    if (!this._repoModule || this._repoModule.moduleId !== moduleId) {
      const module = _.find(this.modules, {moduleId});
      if (module) {
        this.repoModule = module;
        this.repoModule$.next(this.repoModule);
        // console.log('>>>>>>>> repoModule update', this.repoModule.name);
      } else {
        console.error(`No repoModule found for moduleId: ${moduleId}`);
      }
    }
  }

  // set repo module, unset if admin. This will be called from mainComponent constructor, so we're coming
  // into a modules pages, admin will have to pick a module from a dropdown (if they even mess with modules)
  updateRepoModule(moduleId) {
    if (!this._repoModule || this._repoModule.moduleId !== moduleId) {
      const module = _.find(this.modules, {moduleId});
      if (!module) {
        console.error(`No module found for moduleId: ${moduleId}`);
      } else if (this.isAdminModule(module.moduleId)) {
        this._repoModule = undefined;
      } else {
        this._repoModule = module;
      }
      // console.log('>>>>>>>> module update', this.module.name);
    }
  }

  updateModule(moduleId) {
    this.pubDisplayModule(moduleId);
    this.updateRepoModule(moduleId);
  }


  isAdminModule(moduleId) {
    return moduleId === 99;
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
    if (this.displayModule && data.breadcrumbs && data.breadcrumbs.length > 0) {
      data.breadcrumbs.splice(1, 0, {label: this.displayModule.name});
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
