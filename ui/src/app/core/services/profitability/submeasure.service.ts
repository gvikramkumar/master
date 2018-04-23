import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import {HttpClient} from '@angular/common/http';
import {Submeasure} from '../../../store/models/profitability/submeasure';
import {environment} from '../../../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable()
export class SubmeasureService {

  constructor(private httpClient: HttpClient) {
  }

  getMany(): Observable<Submeasure[]> {
    return this.httpClient.get<Submeasure[]>(apiUrl + '/api/submeasure');
  }

  getOne(id: number): Observable<Submeasure> {
    return this.httpClient.get<Submeasure>(apiUrl + `/api/submeasure/${id}`);
  }

  add(data) {
    return this.httpClient.post<Submeasure>(apiUrl + '/api/submeasure', data);
  }

  update(id: number, data: Submeasure): Observable<Submeasure> {
    return this.httpClient.put<Submeasure>(apiUrl + `/api/submeasure/${id}`, data);
  }

  remove(id: number): Observable<Submeasure> {
    return this.httpClient.delete<Submeasure>(apiUrl + `/api/submeasure/${id}`);
  }
}
