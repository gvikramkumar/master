import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ModelBase} from '../../store/models/model-base';
import {AllocationRule} from '../../profitability/store/models/allocation-rule';

const apiUrl = environment.apiUrl;

@Injectable()
export class RestBase<T extends ModelBase> {

  constructor(protected endpointName: string, protected httpClient: HttpClient) {
  }

  getMany(): Observable<T[]> {
    return this.httpClient.get<T[]>(`${apiUrl}/api/${this.endpointName}`);
  }

  getManyLatest(groupField): Observable<T[]> {
    const params = new HttpParams().set('groupField', groupField);
    return this.httpClient.get<T[]>(`${apiUrl}/api/${this.endpointName}`, {params});
  }

  getOneById(id: number): Observable<T> {
    return this.httpClient.get<T>(`${apiUrl}/api/${this.endpointName}/${id}`);
  }

  add(data) {
    return this.httpClient.post<T>(`${apiUrl}/api/${this.endpointName}`, data);
  }

  update(data: T): Observable<T> {
    return this.httpClient.put<T>(`${apiUrl}/api/${this.endpointName}/${data.id}`, data);
  }

  remove(id: number): Observable<T> {
    return this.httpClient.delete<T>(`${apiUrl}/api/${this.endpointName}/${id}`);
  }
}
