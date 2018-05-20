import {Injectable, Type} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Store} from '../../store/store';
import {ModelBase} from '../../store/models/model-base';

const apiUrl = environment.apiUrl;

@Injectable()
export class RestBase<T extends ModelBase> {

  constructor(protected endpointName: string, protected httpClient: HttpClient) {
  }

  getMany(): Observable<T[]> {
    return this.httpClient.get<T[]>(`${apiUrl}/api/${this.endpointName}`);
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
