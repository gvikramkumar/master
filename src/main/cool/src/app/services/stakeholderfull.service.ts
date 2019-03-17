import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class StakeholderfullService {

  constructor(private _http: HttpClient, private environmentService: EnvironmentService) {

  }

  getdata(offerId) {
    return this._http.get(this.environmentService.REST_API_RETRIEVE_OFFER_DETAILS_URL + offerId, { withCredentials: true });
  }


  updateOfferDetails(data) {

    let url = this.environmentService.REST_API_UPDATE_OFFER;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true
    };

    return this._http.post(url, data, httpOptions);
  }

  getOfferBuilderData(offerId) {
    let url = this.environmentService.REST_API_RETRIEVE_OFFER_DETAILS_URL + offerId;
    return this._http.get(url, { withCredentials: true });
  }

  getOfferrole() {
    let url = this.environmentService.REST_API_GETFUNCTIONAL_ROLE_URL;
    return this._http.get(url);
  }

  sendEmailNotification(offerId) {
    let url = this.environmentService.REST_API_SEND_EMAIL_NOTIFICATION_POST_URL;
    url += offerId;
    url += '/' + 'Launch In Progress';
    return this._http.post(url, { withCredentials: true });
  }

}
