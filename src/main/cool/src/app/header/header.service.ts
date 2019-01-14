import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class HeaderService {

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  public getUserInfo(user: String) {
    var url = this.environmentService.REST_API_URL_GET_LDAP_INFO;
    return this.httpClient.post(url, { userId: user }, { withCredentials: true });
  }

  public getCurrentUser() {
    var url = this.environmentService.REST_API_URL_GET_CURRENT_USER;
    return this.httpClient.get(url, { withCredentials: true });
  }
}
