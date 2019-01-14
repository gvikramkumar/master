import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import {UserService} from './user.service';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class ViewcommentService {

  constructor(private _http:HttpClient , private environmentService: EnvironmentService) {

  }


  getviewComment(taskId){ debugger;
    
   
    return this._http.get(this.environmentService.REST_API_VIEW_COMMENT_GET_URL+'/'+taskId);
  }

  postviewComment(obj,taskId){debugger;
    console.log("testingpayload",obj);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
    
      }),
    //  withCredentials: true,
    };
    
    return this._http.post(this.environmentService.REST_API_CREATE_COMMENT_URL+'/'+taskId,obj);
  }

}
