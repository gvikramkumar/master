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

  getValues(keys: string[]) {
    keys = keys.map(key => key.trim());
    const params = new HttpParams().set('keys', keys.join(','));
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}`, {params});
  }

  // will 404 if not found
  getWithError(key: string): Observable<any> {
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}/${key}`);
  }

  // will 204 if not found (no error, nothing in body)
  get(key: string): Observable<any> {
    const params = new HttpParams().set('noerror', 'true');
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}/${key}`, {params});
  }

  upsert(key, value) {
    return this.httpClient.put<any>(`${apiUrl}/api/${this.endpointName}/${key}`, {key, value});
  }

  remove(key: string) {
    return this.httpClient.delete<any>(`${apiUrl}/api/${this.endpointName}/${key}`);
  }


}
