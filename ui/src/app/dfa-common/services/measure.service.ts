import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {RestBase} from '../../core/base-classes/rest-base';
import {Measure} from '../models/measure';
import {UtilService} from '../../core/services/util.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MeasureService extends RestBase<Measure> {

  constructor(httpClient: HttpClient, util: UtilService) {
    super('measure', httpClient, util);
  }


}
