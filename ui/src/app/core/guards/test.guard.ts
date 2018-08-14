import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AppStore} from '../../app/app-store';
import {first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TestGuard implements CanActivate {

  constructor(private store: AppStore) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      // this is an example of a third auth guard that would need init and auth guards to run "before" it ran
      return this.store.authorized$.asObservable().pipe(first()).toPromise()
        .then(auth => {
          if (auth) {
            // do your work here
            return true;
          } else {
            return false;
          }
    });
  }

}
