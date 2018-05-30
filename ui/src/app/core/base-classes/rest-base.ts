import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ModelBase} from '../../store/models/model-base';
import {UtilService} from '../services/common/util';
const apiUrl = environment.apiUrl;

export class RestBase<T extends ModelBase> {

  constructor(
    protected endpointName: string,
    protected httpClient: HttpClient,
    protected util: UtilService) {
  }

  getMany(_params = {}): Observable<T[]> {
    const params = this.util.createHttpParams(_params)
    return this.httpClient.get<T[]>(`${apiUrl}/api/${this.endpointName}`, {params});
  }

  getManySortAndPage(skip, limit, sort = null, _params = <any>{}) {
    const params = Object.assign(_params, {setSkip: skip, setLimit: limit});
    if (sort) {
      params.setSort = sort;
    }
  }

  getDistinct(field, _params = {}): Observable<any[]> {
    const params = Object.assign(_params, {getDistinct: field});
    return this.getMany(params);
  }

  getManyLatest(groupField, _params = {}): Observable<T[]> {
    const params = Object.assign(_params, {groupField});
    return this.getMany(params);
  }

  getOneLatest(_params = {}): Observable<T[]> {
    const params = Object.assign(_params, {getLatest: true});
    return this.getMany(params);
  }

  getOneById(id: number): Observable<T> {
    return this.httpClient.get<T>(`${apiUrl}/api/${this.endpointName}/${id}`);
  }

  postQuery(data) {
    return this.httpClient.post<T>(`${apiUrl}/api/${this.endpointName}?queryPost=true`, data);
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
