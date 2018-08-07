import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Submeasure} from '../models/submeasure';
import {environment} from '../../../../environments/environment';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';
import {GroupingSubmeasure} from '../../../../../../server/api/common/submeasure/grouping-submeasure';
import {Observable} from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SubmeasureService extends RestBase<Submeasure> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('submeasure', httpClient, store, true);
  }

  getGroupingSubmeasures(measureId: number): GroupingSubmeasure[] {
    return <any>super.callMethod('getGroupingSubmeasures', {measureId});
  }

}
