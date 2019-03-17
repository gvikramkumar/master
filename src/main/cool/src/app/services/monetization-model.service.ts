import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EnvironmentService } from '../../environments/environment.service';


@Injectable()
export class MonetizationModelService {

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) { }


  getAttributes() {
    let url = this.environmentService.REST_API_RETRIEVE_MM_OFFER_DIMENSIONS_ATTRIBUTES_URL;
    return this.http.get(url, { withCredentials: true });
  }

  getOfferBuilderData(offerId) {
    let url = this.environmentService.REST_API_RETRIEVE_OFFER_DETAILS_URL + offerId;
    return this.http.get(url, { withCredentials: true });
  }

  toNextSetp(data): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true,
    };

    let url = this.environmentService.REST_API_VALIDATE_OFFER_DIMENSIONS_INFO_URL;
    return this.http.post(url, data, httpOptions);
  };

  showDefaultStakeHolders(model, be) {
    let url = this.environmentService.REST_API_RETRIEVE_DEFAULT_STAKEHOLDERS_URL;
    url += model;
    url += "/" + be;
    return this.http.get(url);
  }

  getPDF(offerId) {
    let url = this.environmentService.REST_API_DOWNLOAD_PDF_GET_URL + '/' + offerId;
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get(url, { headers: headers, responseType: 'blob' });

  }

  proceedToStakeholder(data) {
    let url = this.environmentService.REST_API_UPDATE_OFFER;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true
    };

    return this.http.post(url, data, httpOptions);
  }


  postRuleResult(data) {
    let url = this.environmentService.REST_API_RETRIEVE_OFFER_DIMENSIONS_INFO_URL + '/';
    return this.http.post(url, data);
  }
  
}
