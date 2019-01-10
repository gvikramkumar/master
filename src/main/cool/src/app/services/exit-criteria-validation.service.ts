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

  getExitCriteriaData(caseId){
    let url =this.environmentService.REST_API_OFFERPHASE_DETAILS_URL+"/"+caseId +'/true';
    return this.http.get(url,{withCredentials: true});
  }
  requestApproval(offerId){
    let url = this.environmentService.REST_API_EXITCRITERIA_REQUEST_APPROVAL_POST_URL;
    url += offerId;
    url += "/" + "strategyReview";
    return this.http.post(url, null, {withCredentials: true});
  }

}
