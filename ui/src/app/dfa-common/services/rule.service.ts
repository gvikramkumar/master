import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AllocationRule} from '../models/allocation-rule';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilService} from '../../core/services/util.service';
import {ModuleRestBase} from '../../core/base-classes/module-rest-base';
import {AppStore} from '../../app/app-store';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class RuleService extends ModuleRestBase<AllocationRule> {

  constructor(httpClient: HttpClient, util: UtilService, store: AppStore) {
    super('allocation-rule', httpClient, util, store);
  }

}
