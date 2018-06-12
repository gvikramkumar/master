import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {RestBase} from '../../core/base-classes/rest-base';
import {Measure} from "../store/models/measure";
import {UtilService} from "../../core/services/util.service";
import {DollarUpload} from '../store/models/dollar-upload';

const apiUrl = environment.apiUrl;

@Injectable()
export class DollarUploadService extends RestBase<any> {

  constructor(httpClient: HttpClient, util: UtilService) {
    super('pft/dollar-upload', httpClient, util)
  }


}
