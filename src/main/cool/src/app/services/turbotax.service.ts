import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import {UserService} from './user.service';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class TurbotaxService {

  constructor( private _http:HttpClient) { }

  getTurboTaxDetails(){debugger
   // let url="https://cool-srv-dev.cisco.com/coolsrv/bpmApi/getMilestones/CASE-0000000053/false";
  let url="https://cool-srv-dev.cisco.com/coolsrv/bpmApi/getMilestones/CASE-0000000040/false";
  
    return this._http.get(url,{withCredentials:true});
  }

}
