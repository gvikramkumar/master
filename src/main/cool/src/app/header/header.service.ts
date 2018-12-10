import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class HeaderService {

  constructor(private httpClient: HttpClient) { }

  public getUserInfo(user: String) {
    var url = environment.REST_API_USER_INFO_URL;
    return this.httpClient.post(url, { userId: user }, { withCredentials: true });
  }
  public getCurrentUser() {
    var url = environment.REST_API_URL_GET_CURRENT_USER;
    return this.httpClient.get(url, { withCredentials: true });
  }

}
