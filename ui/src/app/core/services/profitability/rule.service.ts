import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AllocationRule} from '../../../store/models/profitability/allocation-rule';
import * as _ from 'lodash';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable()
export class RuleService {

  constructor(private httpClient: HttpClient) {
  }

  getMany(): Observable<AllocationRule[]> {
    return this.httpClient.get<AllocationRule[]>(apiUrl + '/api/allocation-rule');
  }

  getOne(id: number): Observable<AllocationRule> {
    return this.httpClient.get<AllocationRule>(apiUrl + `/api/allocation-rule/${id}`);
  }

  add(data) {
    return this.httpClient.post<AllocationRule>(apiUrl + '/api/allocation-rule', data);
  }

  update(data: AllocationRule): Observable<AllocationRule> {
    return this.httpClient.put<AllocationRule>(apiUrl + `/api/allocation-rule/${data.id}`, data);
  }

  remove(id: number): Observable<AllocationRule> {
    return this.httpClient.delete<AllocationRule>(apiUrl + `/api/allocation-rule/${id}`);
  }
}
