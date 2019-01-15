import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { EnvironmentService } from '../environments/environment.service';


@Injectable()
export class SharedService {
    businessEntityUrl: string = this.environmentService.PDAF_API+'?columns=BE&distinct=true';
    constructor(private _http:HttpClient, private environmentService: EnvironmentService){
    }

    /**
     * Get Functional Roles
     */
    getFunctionalRoles():Observable<any>{
        let url = this.environmentService.REST_API_RIGISTERNEWUSER_GET_URL;
        return this._http.get(url, {withCredentials:true});
    }

    /**
     * Function to get business entities for the selected business units, from
     * pdaf service
     * @param bus
     */
    getBusinessEntity(): Observable<any> {
        const url = this.businessEntityUrl;
        return this._http.get(url, {withCredentials:true});
    }

    proceedToNextPhase(data) {
        let url = this.environmentService.REST_API_HOLD_OFFER;
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Accept' : 'application/json'
            }),
            withCredentials: true,
          };
        return this._http.post(url, data, httpOptions);
    }

}
