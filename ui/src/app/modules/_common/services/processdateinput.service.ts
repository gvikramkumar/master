import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ProcessDateInput} from '..//models/processdateinput';
import {AppStore} from '../../../app/app-store';
import {RestBase} from '../../../core/base-classes/rest-base';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProcessDateInputService extends RestBase<ProcessDateInput> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('processdateinput', httpClient, store, true);
  }


}
