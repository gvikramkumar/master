import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import AnyObj from '../../../../../shared/models/any-obj';
import {AppStore} from '../../app/app-store';
import {UiUtil} from '../services/ui-util';
import {shUtil} from '../../../../../shared/shared-util';
import {DfaModule} from '../../modules/_common/models/module';

const apiUrl = environment.apiUrl;

export class RestBase<T extends AnyObj> {
  endpointUrl: string;

  constructor(
    protected endpointName: string,
    protected httpClient: HttpClient,
    protected store: AppStore,
    protected isModuleRepo = false) {
    this.endpointUrl = `${apiUrl}/api/${this.endpointName}`;
  }

  // GetMany special query parameters
  // params get sent in as queryString and become mongo find(filter)
  // other values used to determine query type get pulled out before filtering

  // setYearmo:
  // eg: 201809, this will filter data to updatedDate within that date range, if upperOnly=true
  // then only filters using the upper date of that range. The uploads have fiscalMonth so best done using
  // fiscalMonth for those, it will be indexed.

  // setSkip, setLimit, setSort:
  // support paging

  // getDistinct=someField:
  // gets distinct values for that field after filtering

  // groupField=someField:
  // groups by this field after filtering, then selects latest of each group. This is used to get
  // current rules grouping by name. If setYearmo and upperOnly used, can get current rules for any fiscal month

  // getLatest=true:
  // filters then picks latest value (only returns one value) using updatedDate
  getMany(_params = {}): Observable<T[]> {
    this.addModuleId(_params);
    const params = UiUtil.createHttpParams(_params);
    return this.httpClient.get<T[]>(this.endpointUrl, {params});
  }

  getManyActive(filter: AnyObj = {}) {
    filter.status = 'A';
    return this.getMany(filter);
  }

  getManyPending(filter: AnyObj = {}) {
    filter.status = 'P';
    return this.getMany(filter);
  }

  getLatestByName(params = {}) {
    return this.getManyLatest('name', params);
  }

  getManyLatestGroupByNameActive(moduleId?) {
      const data = moduleId ? {moduleId: moduleId} : {};
    this.addModuleId(data);
    return this.callMethod('getManyLatestGroupByNameActive', data);
  }

  // skip/limit required, sort optional, but surely needed to line up in pages. params become find(filter)
  getManySortAndPage(skip, limit, sort = null, _params = <any>{}) {
    const params = Object.assign(_params, {setSkip: skip, setLimit: limit});
    if (sort) {
      params.setSort = sort;
    }
    return this.getMany(params);
  }

  // selects distinct fieldName, params become distinct(fieldName, filter)
  getDistinct(field, _params = {}): Observable<any[]> {
    const params = Object.assign(_params, {getDistinct: field});
    return this.getMany(params);
  }

  // filters by params, then groups by groupField, then gets latest values of each group using updatedDate
  getManyLatest(groupField, _params = {}): Observable<T[]> {
    const params = Object.assign(_params, {groupField});
    return this.getMany(params);
  }

  // filters by params, then gets latest value using updatedDate
  getOneLatest(_params = {}): Observable<T[]> {
    const params = Object.assign(_params, {getLatest: true});
    return this.getMany(params);
  }

  getOneById(id: string): Observable<T> {
    return this.httpClient.get<T>(`${this.endpointUrl}/${id}`);
  }

  callMethod(method, data = {}, params = {}) {
    this.addModuleId(data);
    return this.httpClient.post<any>(`${this.endpointUrl}/call-method/${method}`, data, {params});
  }

  callRepoMethod(method, data = {}, params = {}) {
    this.addModuleId(data);
    return this.httpClient.post<any>(`${this.endpointUrl}/call-repo-method/${method}`, data, {params});
  }

  // same as getMany(params) just uses POST body instead of querystrings. The post body uses
  // bodyParser.urlEncoded extended version so can accept objects as well. Remains to be tested, but
  // could possibly be used to project via mongos's {prop1: 1, prop2: 1} syntax
  queryPost(params) {
    this.addModuleId(params);
    return this.httpClient.post<T>(`${this.endpointUrl}/query-post`, params);
  }

  /*submitForApproval(data) {
    // todo: change status to pending, send email to admin
    data.status = 'P';
    this.addModuleId(data);
    return this.httpClient.post<T>(this.endpointUrl, data);
  }*/

  add(data) {
    this.addModuleId(data);
    return this.httpClient.post<T>(this.endpointUrl, data);
  }

  upsert(data) {
    this.addModuleId(data);
    return this.httpClient.post<T>(`${this.endpointUrl}/upsert`, data);
  }

  update(data: T): Observable<T> {
    return this.httpClient.put<T>(`${this.endpointUrl}/${data.id}`, data);
  }

  remove(id: string): Observable<T> {
    return this.httpClient.delete<T>(`${this.endpointUrl}/${id}`);
  }

  /*
  query-one methods:
  a crud version that requires a filter to define uniqueness of rows instead of ids. The querystring must
  ensure uniqueness of records.
   */
  getQueryOne(filter): Observable<T> {
    const params = UiUtil.createHttpParams(filter);
    return this.httpClient.get<T>(`${this.endpointUrl}/query-one`, {params});
  }

  upsertQueryOne(filter, data): Observable<T> {
    const params = UiUtil.createHttpParams(filter);
    return this.httpClient.post<T>(`${this.endpointUrl}/query-one`, data, {params});
  }

  removeQueryOne(filter): Observable<T> {
    const params = UiUtil.createHttpParams(filter);
    return this.httpClient.delete<T>(`${this.endpointUrl}/query-one`, {params});
  }

  // we'll automatically add moduleId to calls without them, but not for itamdmin as that module is only
  // for display purposes, not for data. ITadmin will have to set it's own moduleId
  addModuleId(params) {
    if (this.isModuleRepo && !params.moduleId) {
      const moduleId = this.store.getRepoModule(this.endpointName).moduleId;
      if (shUtil.isAdminModuleId(moduleId)) {
        throw new Error(`No moduleId for itadmin call to ${this.endpointName}`);
      }
      params.moduleId = moduleId;
    }
  }

}
