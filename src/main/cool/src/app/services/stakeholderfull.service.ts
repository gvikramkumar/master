import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {UserService} from './user.service';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class StakeholderfullService {

  constructor(private _http:HttpClient , private environmentService: EnvironmentService) {

   }

   getdata(offerId){ 
   //let url="http://10.24.122.136:8080/coolsrv/stakeholder/getStakeHolderMgnt/MM1/All"

     return this._http.get(this.environmentService.REST_API_STAKEHOLDERLIST_GET_URL+'/'+offerId,{withCredentials:true});
    // return this._http.get(url);
   }


   proceedToStrageyReview(data) {
    let url = this.environmentService.REST_API_UPDATE_OFFER;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
      }),
      withCredentials: true
    }; 
    
    return this._http.post(url, data, httpOptions);
  }

  getOfferBuilderData(offerId) {
    let url =this.environmentService.REST_API_MM_OFFER_BUILDER_GET_URL + offerId;
    return this._http.get(url,{ withCredentials: true });
  }
  
  getOfferrole(){
    let url=this.environmentService.REST_API_GETFUNCTIONAL_ROLE_URL;
    return this._http.get(url);
  }

}
