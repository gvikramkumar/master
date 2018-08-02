import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Measure} from '../models/measure';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';
import {SourceMapping} from '../../../../../../server/api/common/source-mapping/controller';
import {Observable} from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SourceMappingService extends RestBase<SourceMapping> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('source-mapping', httpClient, store, true);
  }

  getModuleSourceArray(): Observable<SourceMapping[]> {
    return this.callMethod('getModuleSourceArray');
  }

  updateModuleSourceArray(arr: SourceMapping[]) {
    return this.callMethod('updateModuleSourceArray', arr);
  }

}
