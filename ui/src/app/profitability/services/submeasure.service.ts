import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Submeasure} from '../store/models/submeasure';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {RestBase} from '../../core/base-classes/rest-base';
import {UtilService} from '../../core/services/util.service';

const apiUrl = environment.apiUrl;

@Injectable()
export class RuleService extends RestBase<Submeasure> {

  constructor(httpClient: HttpClient, util: UtilService) {
    super('submeasure', httpClient, util)
  }

}
