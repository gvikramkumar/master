import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs/index';
import {HttpClient, HttpParams} from '@angular/common/http';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  endpointName = 'lookup';

  constructor(protected httpClient: HttpClient) {
  }

  // will 404 if not found
  getWithError(key: string): Observable<any> {
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}/${key}`);
  }

  // will 204 if not found (no error, nothing in body)
  getNoError(key: string): Observable<any> {
    const params = new HttpParams().set('noerror', 'true');
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}/${key}`, {params});
  }

  add(key, value) {
    return this.httpClient.post<any>(`${apiUrl}/api/${this.endpointName}`, {key, value});
  }

  upsert(key, value) {
    return this.httpClient.put<any>(`${apiUrl}/api/${this.endpointName}/${key}`, {key, value});
  }

  remove(key: string) {
    return this.httpClient.delete<any>(`${apiUrl}/api/${this.endpointName}/${key}`);
  }


}
