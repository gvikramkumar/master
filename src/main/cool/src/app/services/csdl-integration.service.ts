import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable({
    providedIn: 'root',
})
export class CsdlIntegrationService {
    constructor(private _http: HttpClient, private environmentService: EnvironmentService) { }

    getAllProjects(): Observable<any> {
        const url = `${this.environmentService.REST_API_GET_ALL_PROJECTS}` + `/?page_size=9999&project_type=traditional,solution`;
      return this._http.get(url,  {
        headers: new HttpHeaders({
          'Authorization': 'Token 06a920c098371df2b11ebd68a49165ca0d6f5f9a',
          'Content-Type': 'application/json'
        })
      });
  }
}
