import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Measure} from '../models/measure';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MeasureService extends RestBase<Measure> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('measure', httpClient, store, true);
  }


}
