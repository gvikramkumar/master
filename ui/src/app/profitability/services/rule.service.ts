import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AllocationRule} from '../store/models/allocation-rule';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {RestBase} from '../../core/base-classes/rest-base';
import {UtilService} from '../../core/services/util';

const apiUrl = environment.apiUrl;

@Injectable()
export class RuleService extends RestBase<AllocationRule> {

  constructor(httpClient: HttpClient, util: UtilService) {
    super('allocation-rule', httpClient, util)
  }

}
