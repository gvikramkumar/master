import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {Store} from '../../store/store';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const roles = next.data.authorization;
    const path = `path: ${next.pathFromRoot.map(x => x.url.toString())}`;
    // console.log('auth guard', `roles: ${roles}`, path);
    if (!roles) {
      console.error(`No authorization roles for route: ${path}`);
      return false;
    }
    const authorized = this.store.user.isAuthorized(roles);
    if (!authorized) {
      console.error('User not authorized for path:', path);
      return false;
    }
    return true;
  }

}
