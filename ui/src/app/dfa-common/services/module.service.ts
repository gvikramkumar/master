import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Module} from '../models/module';
import {environment} from '../../../environments/environment';
import {AppStore} from '../../app/app-store';
import {RestBase} from '../../core/base-classes/rest-base';
import * as _ from 'lodash';
import {UtilService} from '../../core/services/util.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ModuleService extends RestBase<Module> {

  constructor(httpClient: HttpClient, private store: AppStore, util: UtilService) {
    super('module', httpClient, util)
  }

  getMany(): Observable<Module[]> {
    return super.getMany().pipe(
      tap(modules => this.store.modules = _.sortBy(modules, 'displayOrder'))
    )
  }

}
