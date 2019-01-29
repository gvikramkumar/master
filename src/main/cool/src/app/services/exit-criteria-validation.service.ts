import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EnvironmentService } from '../../environments/environment.service';
import { OfferDimensionComponent } from '../offer-dimension/offer-dimension.component';

@Injectable()
export class ExitCriteriaValidationService {

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) { }

  getExitCriteriaData(caseId) {
    const url =this.environmentService.REST_API_OFFERPHASE_DETAILS_URL+'/'+caseId +'/false';
    return this.http.get(url,{withCredentials: true});
  }
  requestApproval(offerId) {
    let url = this.environmentService.REST_API_EXITCRITERIA_REQUEST_APPROVAL_POST_URL;
    url += offerId;
    url += '/' + 'strategyReview';
    return this.http.post(url, null, {withCredentials: true});
  }
  postForNewAction(offerId,caseId,payload) {
    let url = this.environmentService.REST_API_EXITCRITERIA_REQUEST_ACTION_AUTO_CREATION_URL;
    url += offerId;
    url += '/' + caseId;
    return this.http.post(url, payload);
  }

}
