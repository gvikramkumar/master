import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
      console.log(data);
      if( data.userMappings != null || data.userMappings != undefined) {
        this.functionalRole = data.userMappings[0].functionalRole;
      }
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
