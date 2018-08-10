import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {DfaModule} from '../models/module';
import {environment} from '../../../../environments/environment';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';
import * as _ from 'lodash';
import {UiUtil} from '../../../core/services/ui-util';
import {shUtil} from '../../../../../../shared/shared-util';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PgLookupService extends RestBase<any> {
  constructor(httpClient: HttpClient, store: AppStore) {
    super('pg-lookup', httpClient, store);
  }

  getFiscalMonths() {
    return this.callMethod('getFiscalMonths');
  }

  getRuleCriteriaChoicesSalesLevel1() {
    return this.callMethod('getRuleCriteriaChoicesSalesLevel1');
  }

  getRuleCriteriaChoicesProdTg() {
    return this.callMethod('getRuleCriteriaChoicesProdTg');
  }

  getRuleCriteriaChoicesScms() {
    return this.callMethod('getRuleCriteriaChoicesScms');
  }

  getRuleCriteriaChoicesInternalBeBe() {
    return this.callMethod('getRuleCriteriaChoicesInternalBeBe');
  }

}
