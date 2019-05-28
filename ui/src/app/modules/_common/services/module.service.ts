import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {DfaModule} from '../models/module';
import {environment} from '../../../../environments/environment';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';
import _ from 'lodash';
import {UserService} from '../../../core/services/user.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ModuleService extends RestBase<DfaModule> {

  constructor(httpClient: HttpClient, store: AppStore, private userService: UserService) {
    super('module', httpClient, store);
  }
  // The user has its own modules, so it must be refreshed at the same time
  refreshStoreModulesAndUser(): Promise<DfaModule[]> {
    return Promise.all([
      this.callMethod('getActiveSortedByDisplayOrder').toPromise(),
      this.userService.refreshUser()
    ])
      .then(results => {
        const modules = results[0];
        this.store.pubModules(modules);
        return modules;
      });
  }

  getNonAdminSortedByDisplayOrder(): Observable<DfaModule[]> {
    return this.callMethod('getNonAdminSortedByDisplayOrder');
  }
}
