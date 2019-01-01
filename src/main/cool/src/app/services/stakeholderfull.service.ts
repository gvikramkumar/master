import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import {UserService} from './user.service';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class StakeholderfullService {

  constructor(private _http:HttpClient , private environmentService: EnvironmentService) {

   }

   getdata(){
   //let url="http://10.24.122.136:8080/coolsrv/stakeholder/getStakeHolderMgnt/MM1/All"
     return this._http.get(this.environmentService.REST_API_ACCESS_MANAGEMENT_GETUSER_URL,{withCredentials:true});
    // return this._http.get(url);
   }

}
