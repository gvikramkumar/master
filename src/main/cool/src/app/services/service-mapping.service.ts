import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceMappingService {

  constructor(private _http: HttpClient, private environmentService: EnvironmentService) { }

  getServiceMappingStatus(offerId, ato): Observable<any> {
    const url = `${this.environmentService.REST_API_GET_MAPPING_STATUS}/${offerId}/${ato}`;
    return this._http.get(url, { withCredentials: true });
  }

  downloadConfigSheet(offerId, ato): Observable<any> {
    let url = this.environmentService.REST_API_DOWNLOAD_CONFIG_SHEET + '/' + offerId + '/' +ato;
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/octet-stream');
    return this._http.get(url, { headers: headers, responseType: 'blob' });
  }

  /* call this API from solutioning page where PF details are entered */
  getPFStatusFromMaestro(offerId, pfName): Observable<any> {
    const url = `${this.environmentService.REST_API_GET_MAPPING_STATUS}/${offerId}/${pfName}`;
    return this._http.get(url, { withCredentials: true });
  }
}
