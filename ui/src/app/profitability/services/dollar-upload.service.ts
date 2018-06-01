import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {RestBase} from '../base-classes/rest-base';
import {Measure} from "../../profitability/store/models/measure";
import {UtilService} from "./util";
import {DollarUpload} from '../../profitability/store/models/dollar-upload';

const apiUrl = environment.apiUrl;

@Injectable()
export class DollarUploadService extends RestBase<any> {

  constructor(httpClient: HttpClient, util: UtilService) {
    super('dollar-upload', httpClient, util)
  }


}
