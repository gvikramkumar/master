import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AccessManagementService } from '../../services/access-management.service';

@Injectable()
export class AuthGuard implements CanActivate {
  hasAdminAcess: Boolean = false;
  constructor(private accessMgmtService: AccessManagementService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAdminAccess();
  }

  async checkAdminAccess() {
    console.log('checkAdminAccess')
    const response = await this.accessMgmtService.checkAdminAccess().toPromise().then((data) => {
      this.hasAdminAcess = true;
      console.log(data);
    }, (err) => {
      this.hasAdminAcess = false;
    }
    );

    if (this.hasAdminAcess) {
      return true;
    } else {
      this.router.navigate(['/auth-error']);
      return false;
    }
  }
}
