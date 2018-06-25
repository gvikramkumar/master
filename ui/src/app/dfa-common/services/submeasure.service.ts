import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Submeasure} from '../models/submeasure';
import {environment} from '../../../environments/environment';
import {UtilService} from '../../core/services/util.service';
import {ModuleRestBase} from '../../core/base-classes/module-rest-base';
import {AppStore} from '../../app/app-store';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SubmeasureService extends ModuleRestBase<Submeasure> {

  constructor(httpClient: HttpClient, util: UtilService, store: AppStore) {
    super('submeasure', httpClient, util, store);
  }

}
