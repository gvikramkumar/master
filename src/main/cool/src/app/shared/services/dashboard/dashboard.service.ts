import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '@env/environment.service';
import { UserService } from '../user.service';

@Injectable()


export class DashboardService {

  constructor(private http: HttpClient, private userService: UserService, private environmentService: EnvironmentService) { }

  getMyActionsList(): Observable<any> {
    let url = this.environmentService.REST_API_ACTIONSTRACKER_URL + this.userService.getUserId() + '/false';
    return this.http.get(url, { withCredentials: true });
  }

  getMyOffersList(): Observable<any> {
    let url = this.environmentService.REST_API_MY_OFFERS_URL + this.userService.getUserId();
    return this.http.get(url, { withCredentials: true });
  }

  postDismissNotification(data) {
    return this.http.post(this.environmentService.REST_API_DISMISS_NOTIFICATION, data);
  }

  postFileUploadForAction(caseid, data) {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'multipart/form-data',
    //   }),
    //   withCredentials: true,
    // };
    const url = `${this.environmentService.REST_API_FILE_UPLOAD_FOR_ACTION}/${caseid}`;
    return this.http.post(url, data);
  }

  postComments(data) {
    return this.http.post(this.environmentService.REST_API_DASH_DIFF_APPROVE_COMMENT_URL, data);
  }

  postActionForNapprove(data) {
    return this.http.post(this.environmentService.REST_API_DASH_DIFF_APPROVE_URL, data);
  }
}