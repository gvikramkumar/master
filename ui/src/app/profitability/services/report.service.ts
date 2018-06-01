import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {RestBase} from '../../core/base-classes/rest-base';
import {Reports} from "../store/models/reports";
import {UtilService} from "../../core/services/common/util";

const apiUrl = environment.apiUrl;

@Injectable()
export class ReportService extends RestBase<Reports> {

  constructor(httpClient: HttpClient, util: UtilService) {
    super('measure', httpClient, util)
  }


}
