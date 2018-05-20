import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Module} from '../../../store/models/module';
import {environment} from '../../../../environments/environment';
import {Store} from '../../../store/store';
import {RestBase} from '../../base-classes/rest-base';
import * as _ from 'lodash';

const apiUrl = environment.apiUrl;

@Injectable()
export class ModuleService extends RestBase<Module> {

  constructor(httpClient: HttpClient, private store: Store) {
    super('module', httpClient)
  }

  getMany(): Observable<Module[]> {
    return super.getMany().pipe(
      tap(modules => this.store.modules = _.sortBy(modules, 'seqnum'))
    )
  }

}
