import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class ExitCriteriaValidationService {

  constructor(
    private http: HttpClient,
  ) { }

  getExitCriteriaData(offerId){
    let url =environment.REST_API_MM_OFFER_BUILDER_GET_URL+ offerId;
    return this.http.get(url);
  }

}
