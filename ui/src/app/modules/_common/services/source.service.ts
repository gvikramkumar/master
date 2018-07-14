import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Source} from '../models/source';
import {environment} from '../../../../environments/environment';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';
import * as _ from 'lodash';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SourceService extends RestBase<Source> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('source', httpClient, store);
  }

}
