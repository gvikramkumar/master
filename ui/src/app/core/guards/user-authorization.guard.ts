import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AppStore} from '../../app/app-store';
import {UiUtil} from '../services/ui-util';

@Injectable({
  providedIn: 'root'
})
export class UserAuthorizationGuard implements CanActivate {
  constructor(private store: AppStore, private router: Router, private uiUtil: UiUtil) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    this.store.pubAuthorized(false);
    const userIds = next.data.authorization;
    const path = `path: ${next.pathFromRoot.map(x => x.url.toString())}`;
    // console.log('auth guard', `roles: ${roles}`, path);
    // next.url.forEach(seg => console.log('>>>> seg', seg.path));

    if (!userIds) {
      console.error(`No authorization roles for route: ${path}`);
      return false;
    }

    return this.store.initializedP
      .then(() => {
        const authorized = this.store.user.hasUserId(userIds);
        if (!authorized) {
          this.uiUtil.genericDialog(`Not authorized.`);
          console.log('User not authorized for path:', path);
          this.store.pubAuthorized(false);
          return false;
        }
        this.store.pubAuthorized(true);
        return true;
      });
  }

}
