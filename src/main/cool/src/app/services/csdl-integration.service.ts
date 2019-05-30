import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';
import { CsdlPayload } from '@app/pirate-ship/modules/csdl/model/csdl-payload';

@Injectable({
  providedIn: 'root'
})
export class CsdlIntegrationService {
  constructor(
    private _http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  getAllProjects(searchString: any): Observable<any> {
    const url =
      `${this.environmentService.REST_API_GET_ALL_PROJECTS}/` + searchString;
    return this._http.get(url);
  }

  createCsdlAssociation(csdlPayload: CsdlPayload): Observable<any> {
    return this._http.post(
      this.environmentService.REST_API_POST_CREATE_CSDL_ASSOCIATION,
      csdlPayload,
      { withCredentials: true }
    );
  }

  refreshProjects(): Observable<any> {
    const url = `${this.environmentService.REST_API_REFRESH_PROJECTS}`;
    return this._http.get(url);
  }

  getCsdlInfo(offerId): Observable<any> {
    const url = this.environmentService.REST_API_CSDL_INFO_GET_URL + offerId;
    return this._http.get(url, { withCredentials: true });
  }

  restartCsdlAssociation(csdlPayload: CsdlPayload): Observable<any> {
    return this._http.post(
      this.environmentService.REST_API_CSDL_PUBLISH_INFO_PUT_URL,
      csdlPayload,
      { withCredentials: true }
    );
  }
}
