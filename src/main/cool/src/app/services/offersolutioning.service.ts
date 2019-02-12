import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class OffersolutioningService {
  solutionData:Object = {};

  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  postForOfferSolutioning(data){
    const url = this.environmentService.REST_API_OFFER_SOLUTIONING_POST_URL;
    return this.httpClient.post(url, data);
  }

  saveSolutionData(offerId:string, data:Object) {
    this.solutionData[offerId] = data;
    return null;
  }

  getSolutionData(offerId:string) {
    if (this.solutionData[offerId] != null) {
      return this.solutionData[offerId];
    } else {
      return null;
    }
  }
  notificationPost(data) {
    const url =this.environmentService.REST_API_NOTIFICATION_PRIMARYPOC_POST_URL;
    return this.httpClient.post(url,data);
  }

  getSolutioningPayload(offerId){
    let url = this.environmentService.REST_API_GET_RULE_RESULT_URL;
    url += offerId;
    return  this.httpClient.get(url);
  }
  updateOfferDetails(data){
    let url = this.environmentService.REST_API_UPDATE_OFFER;
    return this.httpClient.post(url, data);
  }
}
