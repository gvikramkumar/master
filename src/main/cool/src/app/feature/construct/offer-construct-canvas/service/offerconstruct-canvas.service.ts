import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '@env/environment.service';

@Injectable({
  providedIn: 'root'
})
export class OfferconstructCanvasService {

  private subject = new Subject<any>();
  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  sendMessage(message: any) {
    this.subject.next({ message });
  }

  getMessage(): Observable<any> {
  return this.subject.asObservable();
  }

  getMMInfo(offerId: string): Observable<any> {
    return this.httpClient.get(this.environmentService.REST_API_RETRIEVE_OFFER_DETAILS_URL + offerId);
  }

  getOfferConstructItems(mmInfo: any): Observable<any> {
    return this.httpClient.post(this.environmentService.REST_API_POST_OFFER_CONSTRUCT_URL, mmInfo, { withCredentials: true });
  }

  searchEgenie(keyword: String): Observable<any> {
    return this.httpClient.get(this.environmentService.PDAF_SEARCH_EGINIE + keyword);
  }

  getPidDetails(keyword: String): Observable<any> {
    return this.httpClient.get(this.environmentService.REST_API_GET_PID_DETAILS_URL + keyword);
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

  validatePID(pid): Observable<any> {
    return this.httpClient.get(this.environmentService.PDAF_ISVALID_EGINIE_PID + pid);
  }

}
