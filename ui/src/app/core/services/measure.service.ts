import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {RestBase} from '../base-classes/rest-base';
import {Measure} from "../../profitability/store/models/measure";
import {UtilService} from "./util";

const apiUrl = environment.apiUrl;

@Injectable()
export class MeasureService extends RestBase<Measure> {

  constructor(httpClient: HttpClient, util: UtilService) {
    super('measure', httpClient, util)
  }


}
