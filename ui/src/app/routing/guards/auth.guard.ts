import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Store} from '../../store/store';
import {Subject} from 'rxjs/Subject';
import {UserService} from "../../core/services/user-service";

@Injectable()
/**
 * LoginGuard
 * desc - verifies user is logged in
 */
export class AuthGuard implements CanActivate {
  response$ = new Subject<boolean>();

  constructor(private userService: UserService, private router: Router, private store: Store) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.store.authenticated) {
      return true;
    } else {
      this.doAuth();
      return this.response$;
    }
  }

  doAuth() {
    // console.log('authguard start');
    this.userService.getUser()
      .map(user => {
        // console.log('authdone');
        this.store.pubAuthenticated(true);
        this.response$.next(true);
        return true;
      })
      .catch(err => {
        this.router.navigateByUrl('/splash');
        this.response$.next(false);
        return Observable.throw(err);
      })
      .subscribe(x => x); // only need this cause we're not returning this function to canActivate
  }
}
