import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';
import { throwError, Observable } from 'rxjs';
import { PirateShip } from '../feature/pirate-ship/model/pirate-ship';
import {catchError, map, switchMap, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OfferSetupService {

  listAtos: any;

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService,
  ) { }

  // --------------------------------------------------------------------------------------------------

  setAtolist(options) {
    this.listAtos = options;
  }

  getAtolist() {
    return this.listAtos;
  }

  // --------------------------------------------------------------------------------------------------

  lockAPIForOWB(offerId: string) {
    const url = this.environmentService.REST_API_LOCK_API_FOR_OWB + offerId;
    return this.http.post(url, { withCredentials: true });
  }

  // --------------------------------------------------------------------------------------------------

  getPirateShipInfo(offerId: string, offerLevel: string, functionalRole: string): Observable<PirateShip> {


    let url = this.environmentService.REST_API_OFFER_PS_MODULE_GET_URL + offerId + '/' + offerLevel + '/' + functionalRole;
    return this.http.get<PirateShip>(url, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  // --------------------------------------------------------------------------------------------------

  getModuleStatus(moduleName, offerLevel, offerId, functionalRole, derivedMM) {
    const url = this.environmentService.REST_API_OFFER_MODULE_STATUS_GET_URL
      + encodeURIComponent(moduleName) + '&offerId=' + offerId + '&offerATOLevel=' + offerLevel
      + '&functionalRole=' + functionalRole + '&mmval=' + derivedMM;
    return this.http.get(url, { withCredentials: true });
  }

  // --------------------------------------------------------------------------------------------------

  getPricing_SKU_Detail(offerId: string, atoName: string) {
    const url = this.environmentService.REST_API_ServiceAPUpdate + '/' + offerId + '/' + atoName + '';
    return this.http.get(url);
  }

  // --------------------------------------------------------------------------------------------------

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    return throwError(errorMessage);
  }

  // --------------------------------------------------------------------------------------------------



}

