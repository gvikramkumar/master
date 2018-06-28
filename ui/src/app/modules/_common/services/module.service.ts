import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {DfaModule} from '../models/module';
import {environment} from '../../../../environments/environment';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';
import * as _ from 'lodash';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ModuleService extends RestBase<DfaModule> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('module', httpClient, store);
  }

  getMany(): Observable<DfaModule[]> {
    return super.getMany().pipe(
      tap(modules => {
        this.store.modules = _.sortBy(modules, 'displayOrder');
        return modules;
      })
    )
  }

}
