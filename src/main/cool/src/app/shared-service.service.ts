import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { EnvironmentService } from '../environments/environment.service';


@Injectable()
export class SharedService {

    constructor(private _http:HttpClient, private environmentService: EnvironmentService){
    }

    getFunctionalRoles():Observable<any>{
        let url = this.environmentService.REST_API_RIGISTERNEWUSER_GET_URL;
        return this._http.get(url, {withCredentials:true});
    }


}
