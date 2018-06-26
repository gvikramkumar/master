import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AllocationRule} from '../models/allocation-rule';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {UtilService} from '../../../core/services/util.service';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class RuleService extends RestBase<AllocationRule> {

  constructor(httpClient: HttpClient, util: UtilService, store: AppStore) {
    super('allocation-rule', httpClient, util, store, true);
  }

}
