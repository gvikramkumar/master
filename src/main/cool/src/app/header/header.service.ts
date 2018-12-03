import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class HeaderService {

  constructor(private httpClient: HttpClient) { }

  public getUserInfo() {
    var url = environment.REST_API_URL + "userInfo";
    return this.httpClient.get(url);
  }
  
  public getCurrentUser() {
    var url = environment.REST_API_URL_GET_CURRENT_USER;
    return this.httpClient.get(url);
  }
  
}
