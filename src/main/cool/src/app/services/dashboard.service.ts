import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import {UserService} from './user.service';

@Injectable()
export class DashboardService {
  baseMyActionsUrl: string = environment.REST_API_MYACTIONS_URL;
  baseMyOfferssUrl: string = environment.REST_API_MYOFFERS_URL;
  baseDismissNotificationUrl: string = environment.REST_API_DISMISS_NOTIFICATION;

  constructor(private http:HttpClient, private userService: UserService) { }

  getMyActionsList(): Observable<any> {
    let url = this.baseMyActionsUrl+this.userService.getUserId();
    return this.http.get(url,{ withCredentials: true });
  }

  getMyOffersList(): Observable<any> {
    let url = this.baseMyOfferssUrl+this.userService.getUserId();
    return this.http.get(url,{ withCredentials: true });
  }

  postDismissNotification(data): Observable<any> {
    let url = this.baseDismissNotificationUrl;
    return this.http.post(url, data, { withCredentials: true });
}
}
