import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '@env/environment.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangestatusService {

  constructor(
    private _http: HttpClient, 
    private environmentService: EnvironmentService
  ) { }


  getAllComments(
    moduleName: string, 
    offerId: string): Observable<any> {
    //console.log('Module Name: ', moduleName);
    switch (moduleName) {
      case 'NPI Licensing' : {
        const url = `${this.environmentService.REST_API_GET_ALL_COMMENTS_NPI_URL}/${offerId}`;
        return this._http.get(url, {withCredentials: true});
        break;
      }
      case 'Royalty Setup': {
        const url = `${this.environmentService.REST_API_GET_ALL_COMMENTS_ROYALTY_SETUP}/${offerId}`;
        return this._http.get(url, {withCredentials: true});
        break;
      }
      case 'Offer Attribution': {
        const url = `${this.environmentService.REST_API_GET_ALL_COMMENTS_OFFER_ATTRIBUTION}/${offerId}`;
        return this._http.get(url, {withCredentials: true});
        break;
      }
      case 'Export Compliance' : {
        const url = `${this.environmentService.REST_API_GET_ALL_COMMENTS_EXPORT_COMPLIANCE}/${offerId}`;
        return this._http.get(url, {withCredentials: true});
        break;
      }
      case 'Test Orderability' :  {
        const url = `${this.environmentService.REST_API_GET_ALL_COMMENTS_TESTING}/${offerId}`;
        return this._http.get(url, {withCredentials: true});
        break;
      }
      case 'Pricing Uplift Setup': {
        const url = `${this.environmentService.REST_API_GET_ALL_COMMENTS_PRICING_UPLIFT}/${offerId}`;
        return this._http.get(url, {withCredentials: true});
        break;
      }
    }
  }

  addComment(payload: any): Observable<any[]> {
    
    switch (payload.moduleName) {
      case 'NPI Licensing': {
        const url = `${this.environmentService.REST_API_ADD_COMMENT_NPI_URL}`;
        return this._http.post<any[]>(url, payload);
        break;
      }
      case 'Royalty Setup': {
        const url = `${this.environmentService.REST_API_ADD_COMMENT_ROYALTY}`;
        return this._http.post<any[]>(url, payload);
        break;
      }
      case 'Offer Attribution': {
        const url = `${this.environmentService.REST_API_ADD_COMMENT_OFFER_ATTRIBUTION}`;
        return this._http.post<any[]>(url, payload);
        break;
      }
      case 'Export Compliance': {
        const url = `${this.environmentService.REST_API_ADD_COMMENT_EXPORT_COMPLIANCE}`;
        return this._http.post<any[]>(url, payload);
        break;
      }
      case 'Test Orderability': {
        const url = `${this.environmentService.REST_API_ADD_COMMENT_TESTING}`;
        return this._http.post<any[]>(url, payload);
        break;
      }
      case 'Pricing Uplift Setup': {
        const url = `${this.environmentService.REST_API_ADD_COMMENT_PRICING_UPLIFT}`;
        return this._http.post<any[]>(url, payload);
        break;
      }

    }

  }

  updateStatus(payload: any)  {
    const url = `${this.environmentService.REST_API_UPDATE_MODULE_STATUS_URL}`;
    return this._http.post(url, payload);
  }

  getModuleStatus(offerId: string, caseId: string, moduleName: string) {
    const url = `${this.environmentService.REST_API_GET_MODULE_STATUS_URL}/${offerId}/${caseId}/${moduleName}`;
    return this._http.get(url, {withCredentials: true});
  }
}
