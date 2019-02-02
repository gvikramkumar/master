import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../../environments/environment.service';

@Injectable({
  providedIn: 'root'
})
export class OfferconstructCanvasService {
  url = 'https://cool-srv-dev.cisco.com/coolsrv/offer/getOffersDetails/';
  setOfferConstructURL = "https://cool-srv-dev.cisco.com/coolsrv/setOfferConstruct";

  constructor(private http: HttpClient, private environmentService: EnvironmentService) {}

  getMMInfo(offerId: string): Observable<any> {
    return this.http.get(this.url + offerId);
  }

  getOfferConstructItems(mmInfo: any): Observable<any> {
    return this.http.post(this.setOfferConstructURL,mmInfo, { withCredentials: true });
  }

  searchEgenie(keyword: String): Observable<any> {
    return this.http.get(this.url);
  }

  saveOfferConstructChanges(offerConstructChnages: any): Observable<any> {
    return this.http.post(this.environmentService.REST_API_UPDATE_OFFER, offerConstructChnages, { withCredentials: true });
  }
}
