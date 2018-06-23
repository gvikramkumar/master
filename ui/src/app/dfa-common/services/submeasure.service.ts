import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Submeasure} from '../models/submeasure';
import {environment} from '../../../environments/environment';
import {RestBase} from '../../core/base-classes/rest-base';
import {UtilService} from '../../core/services/util.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SubmeasureService extends RestBase<Submeasure> {

  constructor(httpClient: HttpClient, util: UtilService) {
    super('submeasure', httpClient, util);
  }

}
