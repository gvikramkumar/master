import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  retrieveOfferFlags(offerId: string) {
    const url = `${this.environmentService.REST_API_OFFER_STATUS}/${offerId}`;
    return this.httpClient.get(url);
  }
  updateOfferFlag(offerId: String, flagKey: String, flagValue: Boolean) {
    const url = `${this.environmentService.REST_API_OFFER_STATUS}/${offerId}?flag=${flagKey}&val=${flagValue}`;
    return this.httpClient.post(url, {});
  }
}
