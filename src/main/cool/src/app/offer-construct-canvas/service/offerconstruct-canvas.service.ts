import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../../../environments/environment.service';

@Injectable({
  providedIn: 'root'
})
export class OfferconstructCanvasService {

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  getMMInfo(offerId: string): Observable<any> {
    return this.httpClient.get(this.environmentService.REST_API_MM_OFFER_BUILDER_GET_URL + offerId);
  }

  getOfferConstructItems(mmInfo: any): Observable<any> {
    return this.httpClient.post(this.environmentService.REST_API_SET_OFFERCONSTRUCT_POST_URL, mmInfo, { withCredentials: true });
  }

  searchEgenie(keyword: String): Observable<any> {
    return this.httpClient.get(this.environmentService.PDAF_SEARCH_EGINIE + keyword);
  }

  getPidDetails(keyword: String): Observable<any> {
    return this.httpClient.get(this.environmentService.GET_PID_DETAILS + keyword);
  }

  saveOfferConstructChanges(offerConstructChnages: any): Observable<any> {
    return this.httpClient.post(this.environmentService.REST_API_UPDATE_OFFER, offerConstructChnages, { withCredentials: true });
  }

  downloadZip(offerId) {
    let url = this.environmentService.REST_API_DOWNLOAD_ZIP_GET_URL + offerId + '?files=billing&files=hardware';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/octet-stream');
    return this.httpClient.get(url, { headers: headers, responseType: 'blob' });
  }

  retrieveIccDetails(iccRequest): Observable<any> {
    return this.httpClient.post(this.environmentService.REST_API_GET_ICC_DETAILS_URL, iccRequest);
  }

}
