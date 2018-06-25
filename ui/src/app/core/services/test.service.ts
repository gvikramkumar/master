import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private httpClient: HttpClient) { }

  crashSite() {
    return this.httpClient.get(apiUrl + '/crash-site');
  }

  causeError() {
    return this.httpClient.get(apiUrl + '/cause-error');
  }

}
