import { Injectable } from '@angular/core';
import {RestBase} from '../../../core/base-classes/rest-base';
import {DfaModule} from '../models/module';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AppStore} from '../../../app/app-store';
import {Observable} from 'rxjs/index';
import {environment} from '../../../../environments/environment';
import {ModuleSource} from '../models/module_source';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ModuleSourceService extends RestBase<ModuleSource> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('module-source', httpClient, store);
  }

  getManySortByModuleId() {
    return this.getMany({setSort: 'moduleId'});
  }

}
