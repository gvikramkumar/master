import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AllocationRule} from '../../store/models/profitability/allocation-rule';
import * as _ from 'lodash';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {RestBase} from '../../core/base-classes/rest-base';
import {Store} from '../../store/store';

const apiUrl = environment.apiUrl;

@Injectable()
export class RuleService extends RestBase<AllocationRule> {

  constructor(httpClient: HttpClient) {
    super('allocation-rule', httpClient)
  }

}
