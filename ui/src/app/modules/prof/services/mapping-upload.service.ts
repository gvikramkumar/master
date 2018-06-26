import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {RestBase} from '../../../core/base-classes/rest-base';
import {UtilService} from '../../../core/services/util.service';
import {AppStore} from '../../../app/app-store';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MappingUploadService extends RestBase<any> {

  constructor(httpClient: HttpClient, util: UtilService, store: AppStore) {
    super('prof/mapping-upload', httpClient, util, store);
  }


}
