import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class OffersolutioningService {
  solutionData: Object = {};
  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) { }

  postForOfferSolutioning(data) {
    const url = this.environmentService.REST_API_OFFER_SOLUTIONING_POST_URL;
    return this.httpClient.post(url, data);
  }

  saveSolutionData(offerId: string, data: Object) {
    this.solutionData[offerId] = data;
    return null;
  }

  getSolutionData(offerId: string) {
    if (this.solutionData[offerId] != null) {
      return this.solutionData[offerId];
    } else {
      return null;
    }
  }
  notificationPost(data) {
    const url = this.environmentService.REST_API_NOTIFICATION_PRIMARY_POC_POST_URL;
    return this.httpClient.post(url, data);
  }
  actionPost(data) {
    const url = this.environmentService.REST_API_ACTION_PRIMARY_POC_POST_URL;
    return this.httpClient.post(url, data);
  }

  getSolutioningPayload(offerId) {
    let url = this.environmentService.REST_API_RETRIEVE_OFFER_DIMENSIONS_INFO_URL;
    url += offerId;
    return this.httpClient.get(url);
  }

  updateOfferDetails(data) {
    let url = this.environmentService.REST_API_UPDATE_OFFER;
    return this.httpClient.post(url, data);
  }

  saveOfferSolutionAnswers(offerId: string, offerSolutioningAnswers) {
    const url = this.environmentService.REST_API_SAVE_OR_RETRIEVE_OFFER_SOLUTIONING_ANSWERS + offerId;
    return this.httpClient.post(url, offerSolutioningAnswers);
  }

  retrieveOfferSolutionQuestions(offerId: string) {
    const url = this.environmentService.REST_API_RETRIEVE_OFFER_SOLUTIONING_QUESTIONS + offerId;
    return this.httpClient.get(url);
  }

  retrieveOfferSolutionAnswers(offerId: string) {
    const url = this.environmentService.REST_API_SAVE_OR_RETRIEVE_OFFER_SOLUTIONING_ANSWERS + offerId;
    return this.httpClient.get(url);
  }

  retrieveOfferFlags(offerId: string) {
    const url = `${this.environmentService.REST_API_OFFER_STATUS}${offerId}`;
    return this.httpClient.get(url);
  }
  updateOfferFlag(offerId: String, flagKey: String, flagValue: Boolean) {
    const url = `${this.environmentService.REST_API_OFFER_STATUS}${offerId}?flag=${flagKey}&val=${flagValue}`;
    return this.httpClient.post(url, {});
  }

  checkStatusOnMaestro(offerId: string, productFamily:string){
    const url = this.environmentService.REST_CHECK_MAESTRO_PF_STATUS + '/' + offerId + '/' + productFamily;
    return this.httpClient.get(url);
  }

}
