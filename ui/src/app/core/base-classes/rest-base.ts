import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilService} from '../services/util.service';
import AnyObj from '../../../../../shared/models/any-obj';
import {AppStore} from '../../app/app-store';

const apiUrl = environment.apiUrl;

export class RestBase<T extends AnyObj> {

  constructor(
    protected endpointName: string,
    protected httpClient: HttpClient,
    protected util: UtilService,
    protected store: AppStore,
    protected isModuleRepo = false) {
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
    const params = this.util.createHttpParams(_params)
    return this.httpClient.get<T[]>(`${apiUrl}/api/${this.endpointName}`, {params});
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
    return this.httpClient.get<T>(`${apiUrl}/api/${this.endpointName}/${id}`);
  }

  // same as getMany(params) just uses POST body instead of querystrings. The post body uses
  // bodyParser.urlEncoded extended version so can accept objects as well. Remains to be tested, but
  // could possibly be used to project via mongos's {prop1: 1, prop2: 1} syntax
  queryPost(params) {
    this.addModuleId(params);
    return this.httpClient.post<T>(`${apiUrl}/api/${this.endpointName}?queryPost=true`, params);
  }

  add(data) {
    this.addModuleId(data);
    return this.httpClient.post<T>(`${apiUrl}/api/${this.endpointName}`, data);
  }

  update(data: T): Observable<T> {
    return this.httpClient.put<T>(`${apiUrl}/api/${this.endpointName}/${data.id}`, data);
  }

  remove(id: string): Observable<T> {
    return this.httpClient.delete<T>(`${apiUrl}/api/${this.endpointName}/${id}`);
  }

  addModuleId(params) {
    if (this.isModuleRepo) {
      params.moduleId = this.store.moduleId;
    }
  }

}
