import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class ExitCriteriaValidationService {

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) { }

  getExitCriteriaData(offerId){
    let url =this.environmentService.REST_API_MM_OFFER_BUILDER_GET_URL+ offerId;
    return this.http.get(url,{withCredentials: true});
  }
  requestApproval(offerId, mileStone){
    let url = this.environmentService.REST_API_EXITCRITERIA_REQUEST_APPROVAL_POST_URL+ offerId + mileStone;
    url += offerId;
    url += "/" + mileStone;
    return this.http.post(url, null, {withCredentials: true});
  }

}
