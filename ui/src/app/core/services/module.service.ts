import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Module} from '../../store/models/module';
import {environment} from '../../../environments/environment';
import {Store} from '../../store/store';
import {RestBase} from '../base-classes/rest-base';
import * as _ from 'lodash';
import {UtilService} from './util.service';

const apiUrl = environment.apiUrl;

@Injectable()
export class ModuleService extends RestBase<Module> {

  constructor(httpClient: HttpClient, private store: Store, util: UtilService) {
    super('module', httpClient, util)
  }

  getMany(): Observable<Module[]> {
    return super.getMany().pipe(
      tap(modules => this.store.modules = _.sortBy(modules, 'displayOrder'))
    )
  }

}
