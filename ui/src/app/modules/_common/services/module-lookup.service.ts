import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs/index';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LookupService} from './lookup.service';
import {AppStore} from '../../../app/app-store';
import {UiUtil} from '../../../core/services/ui-util';
import {shUtil} from '../../../../../../shared/shared-util';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ModuleLookupService {
  endpointName = 'module-lookup';

  constructor(protected httpClient: HttpClient, private store: AppStore) {
  }
  // moduleId/keys >> {key, value} each key is a property in the object, no prop if no value (json.stringify)
  getManyValuesOneModule(keys: string[], moduleId?: number) {
    keys = keys.map(key => key.trim());
    let params = new HttpParams().set('keys', keys.join(','));
    params = this.setModuleIdInParams(moduleId, params);
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}`, {params});
  }

  // key/moduleIds >> {moduleId, value}[]
  getOneValueManyModules(key: string, moduleIds: number[]) {
    key = key.trim();
    const params = new HttpParams().set('key', key).set('moduleIds', moduleIds.join(','));
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}`, {params});
  }

  // will 404 if not found
  getWithError(key: string, moduleId?: number): Observable<any> {
    let params = new HttpParams();
    params = this.setModuleIdInParams(moduleId, params);
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}/${key}`, {params});
  }

  // will 204 if not found (no error, just empty)
  get(key: string, moduleId?: number): Observable<any> {
    let params = new HttpParams().set('noerror', 'true');
    params = this.setModuleIdInParams(moduleId, params);
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}/${key}`, {params});
  }

  upsertMany(upserts: {moduleId: number, key: string, value: any}[]) {
    return this.httpClient.put<any>(`${apiUrl}/api/${this.endpointName}`, upserts);
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
      if (shUtil.isAdminModuleId(moduleId)) {
        throw new Error(`No moduleId for itadmin call to ${this.endpointName}`);
      }
    }
    return moduleId;
  }

  setModuleIdInParams(moduleId, params) {
    return params.set('moduleId', String(this.verifyModuleId(moduleId)));
  }

}
