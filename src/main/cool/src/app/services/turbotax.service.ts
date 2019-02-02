import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {UserService} from './user.service';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class TurbotaxService {

  constructor( private _http:HttpClient,private  environmentService:EnvironmentService) { }

  getRubboTaxMenu(caseId):any {
    return this._http.get(this.environmentService.REST_API_TURBO_TAX_MENU + caseId + '/false');
  }

}
