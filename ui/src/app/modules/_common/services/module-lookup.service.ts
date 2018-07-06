import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs/index';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LookupService} from './lookup.service';
import {AppStore} from '../../../app/app-store';
import {uiUtil} from '../../../core/services/ui-util';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ModuleLookupService {
  endpointName = 'module-lookup';

  constructor(protected httpClient: HttpClient, private store: AppStore) {
  }

  getMany(keys: string[], moduleId?: number) {
    keys = keys.map(key => key.trim());
    let params = new HttpParams().set('keys', keys.join(','));
    params = this.setModuleIdInParams(moduleId, params);
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}`, {params});
  }

  // will 404 if not found
  getWithError(key: string, moduleId?: number): Observable<any> {
    let params = new HttpParams();
    params = this.setModuleIdInParams(moduleId, params);
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}/${key}`, {params});
  }

  // will 204 if not found (no error, just empty)
  getNoError(key: string, moduleId?: number): Observable<any> {
    let params = new HttpParams().set('noerror', 'true');
    params = this.setModuleIdInParams(moduleId, params);
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}/${key}`, {params});
  }

  add(key: string, value, moduleId?: number) {
    moduleId = this.verifyModuleId(moduleId);
    return this.httpClient.post<any>(`${apiUrl}/api/${this.endpointName}`, {key, value, moduleId});
  }

  upsert(key, value, moduleId?) {
    moduleId = this.verifyModuleId(moduleId);
    return this.httpClient.put<any>(`${apiUrl}/api/${this.endpointName}/${key}`, {key, value, moduleId});
  }

  remove(key: string, moduleId?: number) {
    let params = new HttpParams();
    params = this.setModuleIdInParams(moduleId, params);
    return this.httpClient.delete<any>(`${apiUrl}/api/${this.endpointName}/${key}`, {params});
  }

  verifyModuleId(moduleId) {
    if (!moduleId) {
      moduleId = this.store.getRepoModule(this.endpointName).moduleId;
      if (uiUtil.isAdminModuleId(moduleId)) {
        throw new Error(`No moduleId for itAdmin call to ${this.endpointName}`);
      }
    }
    return moduleId;
  }

  setModuleIdInParams(moduleId, params) {
    return params.set('moduleId', String(this.verifyModuleId(moduleId)));
  }

}
