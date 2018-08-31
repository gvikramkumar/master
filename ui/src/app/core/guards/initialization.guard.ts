import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject, forkJoin} from 'rxjs';
import {mergeMap, map, catchError} from 'rxjs/operators';
import {Init1, Init2, Init3, Init4, Init5} from '../services/test-init-service';
import {AppStore} from '../../app/app-store';
import {TestService} from '../services/test.service';
import {BreakpointService} from '../services/breakpoint.service';
import {ModuleService} from '../../modules/_common/services/module.service';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
/**
 * InitializationGuard
 * desc - provide a complex hierarchy of initialization "before" app starts up including dependecies of dependencies
 */
export class InitializationGuard implements CanActivate {
  response$ = new Subject<boolean>();

  constructor(private store: AppStore,
              private route: ActivatedRoute,
              private breakpoints: BreakpointService,
              private moduleService: ModuleService,
              private testService: TestService,
              private userService: UserService) {
    // testService.causeError().subscribe();
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.handleCanActivate();
  }

  canActivateChild(next: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.handleCanActivate();
  }

  handleCanActivate() {

    if (this.store.initialized) {
      return true;
    } else {
      return this.init();
    }


    /*
        if (this.store.authenticated && this.store.initialized) {
          return true;
        } else {
          const subscription = this.store.subAuthenticated(authenticated => {
            if (authenticated && !this.store.initialized) {
              this.init();
              subscription.unsubscribe();
            }
          });
          return this.response$;
        }
    */
  }

  init() {
    // console.log('initguard start');

    return Promise.all([
      this.moduleService.refreshStore(),
      this.userService.refreshUser(),
    ])
      .then(results => {
        this.afterInit();
        this.store.pubInitialized();
        console.log('app initialized');
        return true;
      })
      .catch(err => {
        throw(err);
      });

  }

  // initialization code that depends on the initial data loads
  afterInit() {

  }
}
