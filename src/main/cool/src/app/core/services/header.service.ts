import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from 'src/environments/environment.service';

@Injectable()
export class HeaderService {

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  public getUserInfo(user: String) {
    const url = this.environmentService.REST_API_LDAP_USER_DETAILS_URL;
    return this.httpClient.post(url, { userId: user }, { withCredentials: true });
  }

  public getCurrentUser() {
    const url = this.environmentService.REST_API_URL_GET_CURRENT_USER_URL;
    return this.httpClient.get(url, { withCredentials: true });
  }

}
