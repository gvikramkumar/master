import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class BupmGuard implements CanActivate {

  constructor() { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return false;
  }


}
