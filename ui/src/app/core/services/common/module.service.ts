import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Module} from '../../../store/models/common/module';
import {environment} from '../../../../environments/environment';
import {Store} from '../../../store/store';
import {RestBase} from './rest-base';
import * as _ from 'lodash';

const apiUrl = environment.apiUrl;

@Injectable()
export class ModuleService extends RestBase<Module> {

  constructor(httpClient: HttpClient, private store: Store) {
    super('module', httpClient)
  }

  getMany(): Observable<Module[]> {
    return super.getMany()
      .do(modules => this.store.modules = _.sortBy(modules, 'seqnum'));
  }

}
