import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {RestBase} from '../../../core/base-classes/rest-base';
import {AppStore} from '../../../app/app-store';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductClassUploadService extends RestBase<any> {

  constructor(httpClient: HttpClient, store: AppStore) {
    super('prof/product-class-upload', httpClient, store);
  }

}
