import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';


@Injectable({
  providedIn: 'root'
})
export class OfferSetupService {

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) { }

  getModuleData(derivedMM, offerId, functionalRole, offerLevel) {
    const url = this.environmentService.REST_API_OFFER_SETUP_MODULE_GET_URL + derivedMM + '&offerId=' + offerId + '&functionalRole=' + functionalRole + '&offerATOLevel=' + offerLevel;
    return this.http.get(url, { withCredentials: true });
  }


}