import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilService} from '../services/util.service';
import AnyObj from '../../../../../shared/models/any-obj';
import {RestBase} from './rest-base';
import {AppStore} from '../../app/app-store';

const apiUrl = environment.apiUrl;

export class ModuleRestBase<T extends AnyObj> extends RestBase<T> {

  constructor(
    endpointName: string,
    httpClient: HttpClient,
    util: UtilService,
    protected store: AppStore) {
    super(endpointName, httpClient, util);
  }

  getMany(params = <AnyObj>{}): Observable<T[]> {
    params.moduleId = this.store.module.moduleId;
    return super.getMany(params);
  }

  queryPost(params) {
    params.moduleId = this.store.module.moduleId;
    return super.queryPost(params);
  }

  add(data) {
    data.moduleId = this.store.module.moduleId;
    return super.add(data);
  }

}
