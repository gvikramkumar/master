import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { EnvironmentService } from '../../environments/environment.service';
import { CreateAction } from '../models/create-action';
import { CreateActionComment } from '../models/create-action-comment';
import { CreateActionApprove } from '../models/create-action-approve';
import { UserService } from '@app/core/services';

@Injectable()
export class ActionsService {

  constructor(private _http: HttpClient, private userService: UserService, private environmentService: EnvironmentService) { }

  getActionsTracker(): Observable<any> {
    const url = this.environmentService.REST_API_ACTIONS_TRACKER_URL + this.userService.getUserId();
    return this._http.get(url, { withCredentials: true });
  }

  getActionDetails(taskId): Observable<any> {
    const url = `${this.environmentService.REST_API_ACTIONS_TRACKER_DETAILS_URL}/${taskId}`;
    return this._http.get(url, { withCredentials: true });
  }
  getMilestones(offerId): Observable<any> {
    const url = `${this.environmentService.REST_API_RETRIEVE_MILESTONES_URL}/${offerId}/false`;
    return this._http.get(url, { withCredentials: true });
  }

  getAchievedMilestones(caseId): Observable<any> {
    const url = `${this.environmentService.REST_API_RETRIEVE_MILESTONES_URL}/${caseId}/true`;
    return this._http.get(url);
  }

  getFunction(): Observable<any> {
    const url = this.environmentService.REST_API_GET_FUNCTIONAL_ROLE_URL;
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
    console.log('in actions service:: createNotAndConditional');
    const url = this.environmentService.REST_API_POST_ACTION_URL;
    return this._http.post(url, createActionComment);
  }

  createActionApprove(createActionApprove: CreateActionApprove): Observable<any> {
    console.log('in actions service:: createActionApprove');
    const url = this.environmentService.REST_API_POST_ACTION_URL;
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
    const url = this.environmentService.REST_API_EMAIL_NOTIFICATION;
    return this._http.post(url, emailPayload);
  }

  postForNewAction(offerId, caseId, createActionPayload) {
    const url = `${this.environmentService.REST_API_CREATE_STRATEGY_REVIEW_TASKS}${offerId}/${caseId}`;
    return this._http.post(url, createActionPayload);
  }

  escalateNotification(emailPayload) {
    const url = this.environmentService.REST_API_EMAIL_NOTIFICATION;
    return this._http.post(url, emailPayload);
  }

  updateEscalationDetails(payload){
    const url = this.environmentService.REST_API_UPDATE_ESCALATION_DETAILS;
    return this._http.post(url, payload);
  }
  
  downloadActionDetailsFile(caseid) {
    const url = `${this.environmentService.REST_API_DOWNLOAD_FILE_FOR_ACTION}/${caseid}`;
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/octet-stream');
    return this._http.get(url, { headers: headers, responseType: 'blob' });
  }

}
