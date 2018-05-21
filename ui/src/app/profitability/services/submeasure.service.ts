import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as _ from 'lodash';
import {HttpClient} from '@angular/common/http';
import {Submeasure} from '../store/models/submeasure';
import {environment} from '../../../environments/environment';
import {RestBase} from '../../core/base-classes/rest-base';

const apiUrl = environment.apiUrl;

@Injectable()
export class SubmeasureService extends RestBase<Submeasure> {

  constructor(httpClient: HttpClient) {
    super('submeasure', httpClient)
  }

}
