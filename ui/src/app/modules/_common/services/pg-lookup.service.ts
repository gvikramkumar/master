import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {DfaModule} from '../models/module';
import {environment} from '../../../../environments/environment';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';
import * as _ from 'lodash';
import {UiUtil} from '../../../core/services/ui-util';
import {shUtil} from '../../../../../../shared/shared-util';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PgLookupService {
  endpointName = 'pg-lookup';
  constructor(private httpClient: HttpClient, private store: AppStore) {
  }

  getFiscalMonths() {
    return this.httpClient.get<any>(`${apiUrl}/api/${this.endpointName}/getFiscalMonths`);
  }

  // helper function to add moduleId to requests
  addModuleId(params) {
    if (!params.moduleId) {
      const moduleId = this.store.getRepoModule(this.endpointName).moduleId;
      if (shUtil.isAdminModuleId(moduleId)) {
        throw new Error(`No moduleId for itAdmin call to ${this.endpointName}`);
      }
      params.moduleId = moduleId;
    }
  }

}
