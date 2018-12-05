import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class HeaderService {

  constructor(private httpClient: HttpClient) { }

  public getUserInfo() {
    var url = environment.REST_API_URL + "userInfo";
    const headers = new HttpHeaders({'Access-Control-Allow-Origin':'*'});
    return this.httpClient.get(url, {headers:headers , withCredentials:true});
  }
  public getCurrentUser() {
    var url = environment.REST_API_URL_GET_CURRENT_USER;  
    return this.httpClient.get(url);    
  }
 
}
