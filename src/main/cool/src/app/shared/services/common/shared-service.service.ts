import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { EnvironmentService } from '@env/environment.service';

@Injectable()
export class SharedService {

    userFunctionalRole: boolean;
    businessEntityUrl: string = this.environmentService.PDAF_API + '?columns=BE&distinct=true';

    constructor(
        private _http: HttpClient,
        private environmentService: EnvironmentService
    ) { }

    getFunctionalRoles(): Observable<any> {
        let url = this.environmentService.REST_API_GET_FUNCTIONAL_ROLE_URL;
        return this._http.get(url, { withCredentials: true });
    }

    getBusinessEntity(): Observable<any> {
        const url = this.businessEntityUrl;
        return this._http.get(url, { withCredentials: true });
    }

    proceedToNextPhase(data) {
        const url = this.environmentService.REST_API_POST_ACTION_URL;
        return this._http.post(url, data);
    }

}
