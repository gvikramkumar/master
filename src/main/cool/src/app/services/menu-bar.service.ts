import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class MenuBarService {

  constructor(
    private httpClient: HttpClient,
    private environmentService: EnvironmentService
  ) { }

  getMiletsoneDetails(caseId): any {
    return this.httpClient.get(this.environmentService.REST_API_RETRIEVE_MILESTONES_URL + '/' + caseId + '/false');
  }

  holdOffer(data): any {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true,
    };

    return this.httpClient.post(this.environmentService.REST_API_POST_ACTION_URL, data, httpOptions);
  }

  cancelOffer(data): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true,
    };

    return this.httpClient.post(this.environmentService.REST_API_POST_ACTION_URL, data, httpOptions);
  }

  sendNotification(data: object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true,
    };

    return this.httpClient.post(this.environmentService.REST_API_EMAIL_NOTIFICATION, data, httpOptions);
  }

  getDesignReviewStatus(offerId) {
    let url = this.environmentService.REST_API_OFFER_STATUS;
    url += offerId;
    return this.httpClient.get(url, { withCredentials: true });
  }

  getMarkCompleteStatus(offerId, caseId) {
    let url = this.environmentService.REST_API_GET_MARK_COMPLETE_STATUS_URL;
    url += offerId + '/' + caseId;
    return this.httpClient.get(url, { withCredentials: true });
  }

  updateMarkCompleteStatus(data: object) {
    const url = this.environmentService.REST_API_UPDATE_MARK_COMPLETE_STATUS_URL;
    return this.httpClient.post(url, data, { withCredentials: true });
  }

}
