import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import {UserService} from './user.service';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class ActionsService {
  // baseMyActionsUrl: string = environment.REST_API_MYACTIONS_URL;
  // baseMyOfferssUrl: string = environment.REST_API_MYOFFERS_URL;
  //baseDismissNotificationUrl: string = environment.REST_API_DISMISS_NOTIFICATION;

  constructor(private http:HttpClient, private userService: UserService, private environmentService: EnvironmentService) { }

  getActionsTracker(): Observable<any> {
    let url = this.environmentService.REST_API_ACTIONSTRACKER_URL+this.userService.getUserId() + '/true';
    return this.http.get(url,{ withCredentials: true });
  }
}
