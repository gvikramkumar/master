import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class StakeholderfullService {

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) {
  }

  // ---------------------------------------------------------------------------------------------

  updateOfferDetails(data) {

    const url = this.environmentService.REST_API_UPDATE_OFFER;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true
    };

    return this.httpClient.post(url, data, httpOptions);
  }

  retrieveOfferDetails(offerId: string) {
    const url = this.environmentService.REST_API_RETRIEVE_OFFER_DETAILS_URL + offerId;
    return this.httpClient.get(url, { withCredentials: true });
  }

  // ---------------------------------------------------------------------------------------------

  getOfferrole() {
    const url = this.environmentService.REST_API_GET_FUNCTIONAL_ROLE_URL;
    return this.httpClient.get(url);
  }

  sendEmailNotification(offerId: string) {
    let url = this.environmentService.REST_API_SEND_EMAIL_NOTIFICATION_POST_URL;
    url += offerId;
    url += '/' + 'Launch In Progress';
    return this.httpClient.post(url, { withCredentials: true });
  }

  getUniqueEmailNotification(offerId) {
    let url = this.environmentService.REST_API_OFFER_STATUS;
    url += offerId;
    return this.httpClient.get(url, { withCredentials: true });
  }

  uniqueEmailNotification(offerId) {
    let url = this.environmentService.REST_API_OFFER_STATUS;
    url += offerId;
    url += '?flag=proceedToStrategyReview&val=true';
    return this.httpClient.post(url, { withCredentials: true });
  }

  // ---------------------------------------------------------------------------------------------

}
