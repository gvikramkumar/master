import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import {UserService} from './user.service';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()


export class DashboardService {
  
 constructor(private http:HttpClient, private userService: UserService, private environmentService: EnvironmentService) { }

  getMyActionsList(): Observable<any> {
    let url = this.environmentService.REST_API_ACTIONSTRACKER_URL+this.userService.getUserId()+'/false';
    return this.http.get(url,{ withCredentials: true });
  }

  getMyOffersList(): Observable<any> {
    let url = this.environmentService.REST_API_MYOFFERS_URL+this.userService.getUserId();
    return this.http.get(url,{ withCredentials: true });
  }

  postDismissNotification(data): Observable<any> {
    

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
      }),
      withCredentials: true
    };
    let url = this.environmentService.REST_API_DISMISS_NOTIFICATION;
    console.log("url:::",url);
    return this.http.post(url, data,httpOptions);
}
}
