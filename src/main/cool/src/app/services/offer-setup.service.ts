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

  getModuleData(derivedMM,offerId,functionalRole) {
    const url = this.environmentService.REST_API_OFFER_SETUP_MODULE_GET_URL + derivedMM +'&offerId=' + offerId +'&functionalRole=' + functionalRole;
    return this.http.get(url, { withCredentials: true });
  }

  getModuleStatus(moduleName,offerLevel,offerId,functionalRole,derivedMM)  {
    debugger;
    const url = this.environmentService.REST_API_OFFER_MODULE_STATUS_GET_URL + encodeURIComponent(moduleName) +'&offerId=' + offerId + '&offerATOLevel='+ offerLevel +'&functionalRole='+ functionalRole + '&mmval=' + derivedMM;
    return this.http.get(url, { withCredentials: true });
  }
}
