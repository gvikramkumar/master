import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { EnvironmentService } from '../../environments/environment.service';
import { CreateAction } from '../models/create-action';
import { CreateActionComment } from '../models/create-action-comment';
import { CreateActionApprove } from '../models/create-action-approve';
import { UserService } from '@shared/services';

@Injectable()
export class ActionsService {
  // baseMyActionsUrl: string = environment.REST_API_MYACTIONS_URL;
  // baseMyOfferssUrl: string = environment.REST_API_MYOFFERS_URL;
  // baseDismissNotificationUrl: string = environment.REST_API_DISMISS_NOTIFICATION;

  constructor(private _http: HttpClient, private userService: UserService, private environmentService: EnvironmentService) { }

  getActionsTracker(): Observable<any> {
    const url = this.environmentService.REST_API_ACTIONSTRACKER_URL + this.userService.getUserId() + '/true';
    return this._http.get(url, { withCredentials: true });
  }

  getMilestones(caseId): Observable<any> {
    const url = `${this.environmentService.REST_API_CREATE_NEW_ACTION_GETMILESTONE_URL}/${caseId}/false`;

    return this._http.get(url, { withCredentials: true });
  }
  getAchievedMilestones(caseId): Observable<any> {
    const url = `${this.environmentService.REST_API_CREATE_NEW_ACTION_GETMILESTONE_URL}/${caseId}/true`;
    return this._http.get(url);
  }

  getFunction(): Observable<any> {
    const url = this.environmentService.REST_API_CREATE_NEW_ACTION_GET_FUNCTION_URL;
    return this._http.get(url, { withCredentials: true });
  }

  getAssignee(offerId): Observable<any> {
    const url = `${this.environmentService.REST_API_CREATE_NEW_ACTION_GET_ASSIGNEE_URL}${offerId}`;
    return this._http.get(url, { withCredentials: true });
  }

  createConditionalApprovalAction(createActionPayload) {
    const url = this.environmentService.REST_API_CREATE_MANUAL_ACTION_POST_URL;
    return this._http.post(url, createActionPayload);
  }

  createNewAction(newActionData: CreateAction): Observable<any> {
    const url = this.environmentService.REST_API_CREATE_MANUAL_ACTION_POST_URL;
    return this._http.post(url, newActionData).pipe(
      flatMap(res => {
        return this.sendNotification(newActionData.assignee, newActionData.offerId, newActionData.actionTitle, newActionData.description);
      })
    );
  }

  createNotAndConditional(createActionComment: CreateActionComment): Observable<any> {
    const url = this.environmentService.REST_API_CREATE_BPM_APPROVAL_URL;
    return this._http.post(url, createActionComment);
  }

  createActionApprove(createActionApprove: CreateActionApprove): Observable<any> {
    const url = this.environmentService.REST_API_CREATE_BPM_APPROVAL_URL;
    return this._http.post(url, createActionApprove);
  }

  sendNotification(userId, offerId, actionTitle, actionDescription): Observable<any> {
    const emailPayload = {};
    emailPayload['subject'] = 'You have been assigned an action';
    emailPayload['emailBody'] = `
    You have been assigned an action for Offer ID:${offerId}
    Title: ${actionTitle}
    Description: ${actionDescription}
    `;
    emailPayload['toMailLists'] = userId;
    const url = this.environmentService.REST_API_ESCALATE_NOTIFICATION_URL;
    return this._http.post(url, emailPayload);
  }

  postForNewAction(offerId, caseId, createActionPayload) {
    const url = `${this.environmentService.REST_API_EXITCRITERIA_REQUEST_ACTION_AUTO_CREATION_URL}${offerId}/${caseId}`;
    return this._http.post(url, createActionPayload);
  }

  escalateNotification(emailPayload) {
    const url = this.environmentService.REST_API_ESCALATE_NOTIFICATION_URL;
    return this._http.post(url, emailPayload);
  }

  downloadActionDetailsFile(caseid) {
    const url = `${this.environmentService.REST_API_FILE_DOWNLOAD_FOR_ACTION}/${caseid}`;
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/octet-stream');
    return this._http.get(url, { headers: headers, responseType: 'blob' });
  }
}
