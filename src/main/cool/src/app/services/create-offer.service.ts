import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {CreateOffer} from '../create-offer-cool/create-offer';
import { UserService } from './user.service';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class CreateOfferService {

  baseUrl: string = environment.REST_API_URL;
  offerCreateUrl: string = this.environmentService.REST_API_OFFER_CREATE_URL;
  basePrimaryUrl: string = this.environmentService.REST_API_PRIMARY_URL;
  secondaryBusinessUnitUrl: string = environment.REST_API_SECONDARY_BUSINESS_UNIT_URL;
  secondaryBusinessEntityUrl: string = environment.REST_API_SECONDARY_BUSINESS_ENTITY_URL;
  secondaryPrimaryBusinessEntityUrl: string = environment.REST_API_PRIMARY_BUSINESS_ENTITY_URL;

  coolOffer;
  coolOfferCopy;
  currenTOffer = new BehaviorSubject<any>('');
  routeFlag  = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient, private userService: UserService, private environmentService: EnvironmentService) {
    this.coolOffer = {
      'offerId': null,
      'offerName': null,
      'offerDesc': null,
      'expectedLaunchDate': null,
      'businessUnit': null,
      'businessEntity': null,
      'secondaryBusinessUnit': null,
      'secondaryBusinessEntity': null
    }
    this.coolOfferCopy = {
      'offerId': null,
      'offerName': null,
      'offerDesc': null,
      'expectedLaunchDate': null,
      'businessUnit': null,
      'businessEntity': null,
      'secondaryBusinessUnit': null,
      'secondaryBusinessEntity': null
    };
  }

  private _mmAssesmentBehaviorSubject = new BehaviorSubject<any>(null);
  public _coolOfferSubscriber = this._mmAssesmentBehaviorSubject.asObservable();

  public subscribeMMAssessment(mmAssessmentResponse) {
    this._mmAssesmentBehaviorSubject.next(mmAssessmentResponse);
  }


  getAllBusinessUnit() {
    let url = this.baseUrl + 'lov/businessUnit';
    return this.httpClient.get(url,  { withCredentials: true });
  }

  getAllBusinessEntity(): Observable<any> {
    let url = this.baseUrl + 'lov/businessEntity';
    return this.httpClient.get(url, { withCredentials: true });
  }

  getPrimaryBusinessUnits(): Observable<any> {
    let url = this.basePrimaryUrl + this.userService.getUserId();
        return this.httpClient.get(url,{ withCredentials: true });
  }

  getSecondaryBusinessUnit() {
    let url = this.secondaryBusinessUnitUrl;
    return this.httpClient.get(url, {withCredentials:true});
  }

  getSecondaryBusinessEntity(bus: string): Observable<any> {
    let url = this.secondaryBusinessEntityUrl + bus;
    return this.httpClient.get(url, {withCredentials:true});
  }

  getPrimaryBusinessEntity(bus: string): Observable<any> {
    // debugger;
    let url = this.secondaryPrimaryBusinessEntityUrl + bus;
    return this.httpClient.get(url, {withCredentials:true});
  }

  getQuestionsBox(): Observable<any> {
    let url = this.baseUrl + 'question';
    return this.httpClient.get(url);
  }

  getOfferBox(): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'mm');
  }

  postDataofMmMapper(obj) {
    let url = this.baseUrl+'mmMapping'
    return this.httpClient.post(url,obj);
  }

  validateCoolOffer() {
    let selectedArray = [];
    let keys = Object.keys(this.coolOffer)
    keys.forEach(key => {
      if (this.coolOffer[key] != null && this.coolOffer[key] !== '') {
        this.routeFlag.next(false);
      }
    });
  }

  getOfferById(offerId) {
    let url = this.baseUrl + 'offer/'+offerId;
    return this.httpClient.get(url, { withCredentials: true });
  }

  getMMMapperById(offerId) {
    let url = this.baseUrl + 'mmMapping/'+offerId;
    return this.httpClient.get(url, { withCredentials: true });
  }

  registerOffer(createoffer: CreateOffer): Observable<any> {
    createoffer.userId = this.userService.getUserId();
    createoffer.offerCreatedBy = this.userService.getUserId();
    createoffer.offerOwner = this.userService.getUserId();
    return this.httpClient.post(this.offerCreateUrl, createoffer, { withCredentials: true, responseType: 'text' });
  }

}
