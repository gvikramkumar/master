import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Module} from '../../../store/models/common/module';
import {environment} from '../../../../environments/environment';
import {Store} from '../../../store/store';

const apiUrl = environment.apiUrl;

@Injectable()
export class ModuleService {

  constructor(private store: Store, private httpClient: HttpClient) {
  }

  getMany(): Observable<Module[]> {
    return this.httpClient.get<Module[]>(apiUrl + '/api/module')
      .do(modules => this.store.modules = modules)
  }

  getOne(id: number): Observable<Module> {
    return this.httpClient.get<Module>(apiUrl + `/api/module/${id}`);
  }

  add(data) {
    return this.httpClient.post<Module>(apiUrl + '/api/module', data);
  }

  update(id: number, data: Module): Observable<Module> {
    return this.httpClient.put<Module>(apiUrl + `/api/module/${id}`, data);
  }

  remove(id: number): Observable<Module> {
    return this.httpClient.delete<Module>(apiUrl + `/api/module/${id}`);
  }
}
