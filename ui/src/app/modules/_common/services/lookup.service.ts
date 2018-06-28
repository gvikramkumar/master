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

  constructor(private httpClient: HttpClient) {
  }

  getValue(key: string, ignoreError = false): Observable<any> {
    let params = new HttpParams();
    if (ignoreError) {
      params = params.set('noerror', 'true');
    }

    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}/${key}`, {params});
  }

  add(key, value) {
    return this.httpClient.post<any>(`${apiUrl}/api/${this.endpointName}`, {key, value});
  }

  update(key, value) {
    return this.httpClient.put<any>(`${apiUrl}/api/${this.endpointName}/${key}`, {key, value});
  }

  remove(key: string) {
    return this.httpClient.delete<any>(`${apiUrl}/api/${this.endpointName}/${key}`);
  }


}
