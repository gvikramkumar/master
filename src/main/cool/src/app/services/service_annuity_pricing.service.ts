import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '@env/environment.service';
import { ServiceAnnuityDesign } from '@app/feature/pirate-ship/modules/service-annuity-pricing/model/service-annuity-design';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceAnnuityPricingService {

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  getOfferDropdownValues(offerId): Observable<any>{
    const url = `${this.environmentService.REST_API_RETRIEVE_SERVICE_ATO_LIST_URL}/${offerId}`;
    return this.httpClient.get(url, { withCredentials: true });
  }

  getServiceAnnuityPricing(offerId): Observable<any>{
    const url = `${this.environmentService.REST_API_RETRIEVE_SERVICE_ANNUITY_PRICING_URL}/${offerId}`;
    return this.httpClient.get(url, { withCredentials: true });
  }

}
