import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AppStore} from '../../app/app-store';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
  constructor(private store: AppStore, private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const roles = next.data.authorization;
    const path = `path: ${next.pathFromRoot.map(x => x.url.toString())}`;
    // console.log('auth guard', `roles: ${roles}`, path);
    // next.url.forEach(seg => console.log('>>>> seg', seg.path));

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
