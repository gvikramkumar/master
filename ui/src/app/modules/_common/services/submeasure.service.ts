import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Submeasure} from '../models/submeasure';
import {environment} from '../../../../environments/environment';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SubmeasureService extends RestBase<Submeasure> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('submeasure', httpClient, store, true);
  }

}
