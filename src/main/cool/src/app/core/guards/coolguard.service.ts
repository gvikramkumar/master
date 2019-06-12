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

        data.forEach((value, ind) => {
          if (Object.keys(value)[0].substring(0, 7) === "COOL - ") {
            Object.defineProperty(value, Object.keys(value)[0].substring(7),
              Object.getOwnPropertyDescriptor(value, Object.keys(value)[0]));
            delete value[Object.keys(value)[0]];
          }
          
          let bupmString = "Business Unit Product Manager (BUPM)";
          if (Object.keys(value)[0] === bupmString) {
            Object.defineProperty(value, Object.keys(value)[0].substring(31,35),
              Object.getOwnPropertyDescriptor(value, Object.keys(value)[0]));
            delete value[Object.keys(value)[0]];
          }
        })

        let unTrimmed = [];
        for (let item of data) {
          unTrimmed.push(...Object.keys(item));
        }
      
        if (data.length === 0 || data[0].error || (unTrimmed.indexOf(this.functionalRole)) === -1) {
          this.router.navigate(['/errorpage']);
          return false;
        } else {
          return true;
        }
      }));
  }

}