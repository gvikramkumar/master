import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';


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

  getPirateShipInfo(offerId: string, offerLevel: string, functionalRole: string) {
    let url = this.environmentService.REST_API_OFFER_SETUP_MODULE_GET_URL + offerId + '/' + offerLevel + '/' + functionalRole;
    if (window.localStorage.getItem('showSprint6')) {
      url = this.environmentService.REST_API_OFFER_PS_MODULE_GET_URL + offerId + '/' + offerLevel + '/' + functionalRole;
    }
    return this.http.get(url, { withCredentials: true });
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
}

