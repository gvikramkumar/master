import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import {UserService} from './user.service';

@Injectable()
export class DashboardService {
  baseMyActionsUrl: string = environment.REST_API_MYACTIONS_URL;
  baseMyOfferssUrl: string = environment.REST_API_MYOFFERS_URL;

  constructor(private http:HttpClient, private userService: UserService) { }

  getRecentOffer():  Observable<any> {
    let url = environment.REST_API_URL+'offer';
    return this.http.get(url);
 }

  getMyActionsList(): Observable<any> {
    console.log(this.userService.userId);
    let url = this.baseMyActionsUrl;
    return this.http.get(url);
  }

  getMyOffersList(): Observable<any> {
    console.log(this.userService.userId);
    let url = this.baseMyOfferssUrl;
    return this.http.get(url);
  }


}
