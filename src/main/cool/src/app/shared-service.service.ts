import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../environments/environment.service';


@Injectable()
export class SharedService {
    businessEntityUrl: string = this.environmentService.PDAF_API + '?columns=BE&distinct=true';
    userEventEmit = new EventEmitter();
    userFunctionalRole:boolean;
    constructor(private _http: HttpClient, private environmentService: EnvironmentService) {
    }

    /**
     * Get Functional Roles
     */
    getFunctionalRoles(): Observable<any> {
        let url = this.environmentService.REST_API_GET_FUNCTIONAL_ROLE_URL;
        return this._http.get(url, { withCredentials: true });
    }

    /**
     * Function to get business entities for the selected business units, from
     * pdaf service
     * @param bus
     */
    getBusinessEntity(): Observable<any> {
        const url = this.businessEntityUrl;
        return this._http.get(url, { withCredentials: true });
    }

    proceedToNextPhase(data) {
        const url = this.environmentService.REST_API_POST_ACTION_URL;
        return this._http.post(url, data);
    }

}
