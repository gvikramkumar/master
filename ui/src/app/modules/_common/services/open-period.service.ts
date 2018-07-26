import { Injectable } from '@angular/core';
import {RestBase} from '../../../core/base-classes/rest-base';
import {DfaModule} from '../models/module';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AppStore} from '../../../app/app-store';
import {Observable} from 'rxjs/index';
import {environment} from '../../../../environments/environment';
import {OpenPeriod} from '../models/open-period';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class OpenPeriodService extends RestBase<OpenPeriod> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('open-period', httpClient, store);
  }

}
