import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';


@Injectable()
export class MonetizationModelService {
 

  constructor(
    private http: HttpClient,
   
    ) { }

 
  getAttributes(){
    let url =environment.REST_API_MMOFFER_ATTRIBUTES_URL;
    return this.http.get(url,{ withCredentials: true });
  }

  getOfferBuilderData(offerId) {
    // debugger;
    let url =environment.REST_API_MM_OFFER_BUILDER_GET_URL + offerId;
    return this.http.get(url,{ withCredentials: true });
  }

  toNextSetp(data):Observable<any> {
    // console.log(data);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
      })
     
    };
    let url = environment.REST_API_MMATTRIBUTES_POST_URL;
    return this.http.post(url, data,httpOptions);
    
    
  }

  showStakeholders(model, be){
    let url = environment.REST_API_MM_STAKEHOLDERS_GET_URL;
    url += model;
    url += "/" + be;
    return this.http.get(url);
  }
}