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
    // console.log('auth guard', `roles: ${roles}`, `path: ${next.pathFromRoot.map(x => x.url.toString())}`);
/*
    if (!roles || !roles.length) {
      console.error(`No authorization roles for route: ${next.url}.`);
      return false;
    }
*/
    return this.store.user.isAuthorized(roles);
  }

}
