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
import AnyObj from '../../../../../../shared/models/any-obj';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PgLookupService extends RestBase<any> {
  constructor(httpClient: HttpClient, store: AppStore) {
    super('pg-lookup', httpClient, store);
  }

  getSortedListFromColumn(table, column, whereClause?, isNumber?) {
    const params: AnyObj = {table, column};
    if (whereClause) {
      params.where = whereClause;
    }
    if (isNumber) {
      params.isNumber = true;
    }
    return this.callMethod('getSortedListFromColumn', params);
  }

  getSortedUpperListFromColumn(table, column, whereClause?) {
    const params: AnyObj = {table, column};
    if (whereClause) {
      params.where = whereClause;
    }
    return this.callMethod('getSortedUpperListFromColumn', params);
  }

  getFiscalMonths() {
    return this.callMethod('getFiscalMonths');
  }

  getSubmeasureFlashCategories() {
    return this.callMethod('getSubmeasureFlashCategories');
  }

  getSubmeasureAdjustmentTypes() {
    return this.callMethod('getSubmeasureAdjustmentTypes');
  }

}
