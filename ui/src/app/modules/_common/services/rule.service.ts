import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AllocationRule} from '../../../../../../shared/models/allocation-rule';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';
import {ApprovalRestBase} from '../../../core/base-classes/approval-rest-base';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class RuleService extends ApprovalRestBase<AllocationRule> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('allocation-rule', httpClient, store, true);
  }

  getLatestByName() {
    return this.getManyLatest('name');
  }

  getLatestByNameActive() {
    return this.getManyLatest('name', {status: 'A'});
  }

  getDistinctRuleNamesActive() {
    return this.getDistinct('name', {status: 'A'});
  }

  getDistinctRuleNames() {
    return this.getDistinct('name', {status: 'A'});
  }

  validateProdPFCritChoices(arr) {
    return this.callMethod('validateProdPFCritChoices', arr);
  }

  validateProdBUCritChoices(arr) {
    return this.callMethod('validateProdBUCritChoices', arr);
  }

}
