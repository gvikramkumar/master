import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Submeasure} from '../../../../../../shared/models/submeasure';
import {environment} from '../../../../environments/environment';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';
import {GroupingSubmeasure} from '../../../../../../server/api/common/submeasure/grouping-submeasure';
import {Observable} from 'rxjs';
import {ApprovalRestBase} from '../../../core/base-classes/approval-rest-base';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SubmeasureService extends ApprovalRestBase<Submeasure> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('submeasure', httpClient, store, true);
  }

  getGroupingSubmeasures(measureId: number): GroupingSubmeasure[] {
    return <any>super.callMethod('getGroupingSubmeasures', {measureId});
  }

  getDistinctSubmeasureNames() {
    return this.getDistinct('name', {status: 'A'});
  }

}
