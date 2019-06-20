import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MenuBarService {
  private subject = new BehaviorSubject<any>('');
  constructor(
    private httpClient: HttpClient,
    private environmentService: EnvironmentService
  ) { }

  getMilestoneDetails(offerId): any {
    return this.httpClient.get(this.environmentService.REST_API_RETRIEVE_MILESTONES_URL + '/' + offerId + '/false');
  }

  holdOffer(data): any {
    console.log('in menu bar service:: holdOffer');
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
    console.log('in menu bar service:: cancelOffer');
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

  updateMarkCompleteStatus(offerId, milestone, milestoneStatus) {
    let url = this.environmentService.REST_API_UPDATE_MARK_COMPLETE_STATUS_URL;
    url += offerId + '/' + milestone + '?status=' + milestoneStatus
    return this.httpClient.put(url, { withCredentials: true });
  }

  updateOfferPhaseWidget(data){
    this.subject.next(data);
  }

  getUpdatedOfferPhaseWidget(): Observable<any> {
  return this.subject.asObservable();
  }


}
