import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CreateOfferService } from '../../services/create-offer.service';

@Injectable()
export class BupmGuard implements CanActivate {
  functionalRole;
  isBupmUser: Boolean = false;
  constructor(private createOfferService: CreateOfferService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.getFunctionalRole();
  }

  async getFunctionalRole() {
    const response = await this.createOfferService.getPrimaryBusinessUnits().toPromise().then((data) => {
      this.functionalRole = data.functionalAppRoleList[0].fnalRole;
    });

    if (this.functionalRole === 'BUPM') {
      console.log(this.functionalRole);
      return true;
    } else {
      this.router.navigate(['/auth-error']);
      return false;
    }
  }
}
