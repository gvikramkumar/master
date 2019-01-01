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

   getdata(offerId){ debugger;

  
     return this._http.get(this.environmentService.REST_API_STAKEHOLDERLIST_GET_URL+'/'+offerId,{withCredentials:true});
    
   }

}
