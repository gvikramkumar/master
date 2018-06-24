import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {RestBase} from '../../core/base-classes/rest-base';
import {UtilService} from '../../core/services/util.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MappingUploadService extends RestBase<any> {

  constructor(httpClient: HttpClient, util: UtilService) {
    super('prof/mapping', httpClient, util);
  }


}
