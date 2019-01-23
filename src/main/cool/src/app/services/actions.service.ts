import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { EnvironmentService } from '../../environments/environment.service';
import { CreateAction } from '../models/create-action';
import { CreateActionComment } from '../models/create-action-comment';
import { CreateActionApprove } from '../models/create-action-approve';

@Injectable()
export class ActionsService {
  // baseMyActionsUrl: string = environment.REST_API_MYACTIONS_URL;
  // baseMyOfferssUrl: string = environment.REST_API_MYOFFERS_URL;
  // baseDismissNotificationUrl: string = environment.REST_API_DISMISS_NOTIFICATION;

  constructor(private http: HttpClient, private userService: UserService, private environmentService: EnvironmentService) { }

  getActionsTracker(): Observable<any> {
    let url = this.environmentService.REST_API_ACTIONSTRACKER_URL + this.userService.getUserId() + '/true';
    return this.http.get(url, { withCredentials: true });
  }

  getMilestones(caseId): Observable<any> {
    let url = this.environmentService.REST_API_CREATE_NEW_ACTION_GETMILESTONE_URL;
    url += "/" + caseId;
    url += "/" + false;

    return this.http.get(url, { withCredentials: true });
  }
  getAchievedMilestones(caseId): Observable<any> {
    const url = `${this.environmentService.REST_API_CREATE_NEW_ACTION_GETMILESTONE_URL}/${caseId}/true`;
    return this.http.get(url);
  }

  getFunction(): Observable<any> {
    let url = this.environmentService.REST_API_CREATE_NEW_ACTION_GET_FUNCTION_URL;
    return this.http.get(url, { withCredentials: true });
  }

  getAssignee(offerId): Observable<any> {
    let url = this.environmentService.REST_API_CREATE_NEW_ACTION_GET_ASSIGNEE_URL;
    url += offerId;
    return this.http.get(url, { withCredentials: true });
  }


  createNewAction(newActionData: CreateAction): Observable<any> {
    let url = this.environmentService.REST_API_CREATE_NEW_ACTION_POST_URL;
    return this.http.post(url, newActionData);
  }

  createNotAndConditional(createActionComment: CreateActionComment): Observable<any> {
    let url = this.environmentService.REST_API_CREATE_BPM_APPROVAL_URL;
    return this.http.post(url, createActionComment);
  }

  createActionApprove(createActionApprove: CreateActionApprove): Observable<any> {
    let url = this.environmentService.REST_API_CREATE_BPM_APPROVAL_URL;
    return this.http.post(url, createActionApprove);
  }

  postForNewAction(offerId, caseId, createActionPayload) {
    let url = this.environmentService.REST_API_EXITCRITERIA_REQUEST_ACTION_AUTO_CREATION_URL;
    url += offerId;
    url += '/' + caseId;
    return this.http.post(url, createActionPayload);
  }

  escalateNotification(emailPayload) {
    let url = this.environmentService.REST_API_ESCALATE_NOTIFICATION_URL;
    return this.http.post(url, emailPayload);
  }
}
