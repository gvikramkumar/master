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

  validateSalesSL2CritChoices(arr) {
    return this.callMethod('validateSalesSL2CritChoices', arr);
  }

  validateSalesSL3CritChoices(arr) {
    return this.callMethod('validateSalesSL3CritChoices', arr);
  }

  validateProdPFCritChoices(arr) {
    return this.callMethod('validateProdPFCritChoices', arr);
  }

  validateProdBUCritChoices(arr) {
    return this.callMethod('validateProdBUCritChoices', arr);
  }

}
