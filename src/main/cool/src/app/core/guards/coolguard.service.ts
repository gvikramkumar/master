import { Injectable } from '@angular/core';
import { AccessManagementService } from '@app/services/access-management.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class COOLguardService {

  public functionalRole: string;

  constructor(private accessMgmtServ: AccessManagementService,
    private router: Router) {

  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.accessMgmtServ.onGetUserCEPM()
      .pipe(map((data: any) => {
        this.accessMgmtServ.sendfunctionalRolRaw.subscribe((value) => {
          this.functionalRole = value;
        });
        let unTrimmed = [];
        for (let item of data) {
          unTrimmed.push(...Object.keys(item));
        }
        let trimmed = [];
        for (let item of unTrimmed) {
          if (item.substring(0, 7) === "COOL - ") {
            trimmed.push(item.substring(7))
          } else {
            trimmed.push(item);
          }
        }
        if (data.length === 0 || data[0].error || (trimmed.indexOf(this.functionalRole)) === -1) {
          this.router.navigate(['/errorpage']);
          return false;
        } else {
          return true;
        }
      }));
  }

}