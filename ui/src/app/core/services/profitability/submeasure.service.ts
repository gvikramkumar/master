import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import {HttpClient} from '@angular/common/http';
import {Submeasure} from '../../../store/models/profitability/submeasure';
import {environment} from '../../../../environments/environment';
import {RestBase} from '../common/rest-base';

const apiUrl = environment.apiUrl;

@Injectable()
export class SubmeasureService extends RestBase<Submeasure> {

  constructor(httpClient: HttpClient) {
    super('submeasure', httpClient)
  }

}
