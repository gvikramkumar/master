import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  downloadZip(offerId) {
    let url = this.environmentService.REST_API_DOWNLOAD_ZIP_GET_URL + offerId + '?files=billing&files=hardware';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/octet-stream');
    return this.http.get(url, { headers: headers, responseType: 'blob' });
  }
}
