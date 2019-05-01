import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessManagementService } from '@app/services/access-management.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private accessMgmtService: AccessManagementService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAdminAccess();
  }

  // Check if user is either a super admin or a functional admin
  async checkAdminAccess() {
    let hasAdminAcess = false;
    const response = await this.accessMgmtService.checkAdminAccess().toPromise().then((resUserInfo) => {
      hasAdminAcess = this.isUserSuperAdmin(resUserInfo) || this.isUserFunctionalAdmin(resUserInfo);
    });

    if (hasAdminAcess) {
      return true;
    } else {
      this.router.navigate(['/auth-error']);
      return false;
    }
  }

  isUserSuperAdmin(userInfo): boolean {
    return userInfo.superAdmin;
  }
  isUserFunctionalAdmin(userInfo): boolean {
    return userInfo.userMapping && userInfo.userMapping.some(mapping => mapping.functionalAdmin);
  }
}
