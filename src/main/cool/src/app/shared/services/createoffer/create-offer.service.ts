import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { EnvironmentService } from '@env/environment.service';
import { CreateOffer } from '@app/feature/create-offer-cool/create-offer';
import { UserService } from '@app/core/services/user.service';

@Injectable()
export class CreateOfferService {

  baseUrl: string = this.environmentService.REST_API_LDAP_USER_DETAILS_URL;
  offerCreateUrl: string = this.environmentService.REST_API_OFFER_CREATE_URL;
  offerUpdateUrl: string = this.environmentService.REST_API_UPDATE_OFFER;
  basePrimaryUrl: string = this.environmentService.REST_API_PRIMARY_URL;
  secondaryBusinessUnitUrl: string = this.environmentService.REST_API_SECONDARY_BUSINESS_UNIT_URL;
  secondaryBusinessEntityUrl: string = this.environmentService.REST_API_SECONDARY_BUSINESS_ENTITY_URL;
  secondaryPrimaryBusinessEntityUrl: string = this.environmentService.REST_API_PRIMARY_BUSINESS_ENTITY_URL;
  getBEUrl: string = this.environmentService.REST_API_PRIMARY_BUSINESS_ENTITY_LULU_URL;
  getPrimaryBUBasedOnBE: string = this.environmentService.REST_API_PRIMARY_BUSINESS_UNIT_LULU_URL;
  getDinstinctBUUrl: string = this.environmentService.REST_API_SECONDARY_BUSINESS_UNIT_LULU_URL;


  coolOffer;
  coolOfferCopy;
  currenTOffer = new BehaviorSubject<any>('');
  routeFlag = new BehaviorSubject<boolean>(false);
  disablePrimaryBEList: boolean = false;

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
    return this.httpClient.get(url, { withCredentials: true });
  }

  getAllBusinessEntity(): Observable<any> {
    let url = this.baseUrl + 'lov/businessEntity';
    return this.httpClient.get(url, { withCredentials: true });
  }
  //Lulu's change on GET BE
  getDistinctBE() {
    let url = this.getBEUrl;
    return this.httpClient.get(url, { withCredentials: true });
  }
  // lulu's change on GET SECONDARY BU
  getDistincBU() {
    let url = this.getDinstinctBUUrl;
    return this.httpClient.get(url, { withCredentials: true });
  }

  //Lulu's change on GET PRIMARY BU BASED ON BE
  getPrimaryBuBasedOnBe(data) {
    let url = this.getPrimaryBUBasedOnBE + data;
    return this.httpClient.get(url, { withCredentials: true });
  }

  getPrimaryBusinessUnits(): Observable<any> {
    let url = this.basePrimaryUrl + this.userService.getUserId();
    return this.httpClient.get(url, { withCredentials: true });
  }

  getSecondaryBusinessUnit() {
    let url = this.secondaryBusinessUnitUrl;
    return this.httpClient.get(url, { withCredentials: true });
  }


  getSecondaryBusinessEntity(bus: string): Observable<any> {
    let url = this.secondaryBusinessEntityUrl + bus;
    return this.httpClient.get(url, { withCredentials: true });
  }

  getPrimaryBusinessEntity(bus: string): Observable<any> {
    let url = this.secondaryPrimaryBusinessEntityUrl + bus;
    return this.httpClient.get(url, { withCredentials: true });
  }

  getQuestionsBox(): Observable<any> {
    let url = this.baseUrl + 'question';
    return this.httpClient.get(url);
  }

  getOfferBox(): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'mm');
  }

  postDataofMmMapper(obj) {
    let url = this.baseUrl + 'mmMapping'
    return this.httpClient.post(url, obj);
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
    let url = this.baseUrl + 'offer/' + offerId;
    return this.httpClient.get(url, { withCredentials: true });
  }

  getMMMapperById(offerId) {
    let url = this.baseUrl + 'mmMapping/' + offerId;
    return this.httpClient.get(url, { withCredentials: true });
  }

  registerOffer(createoffer: CreateOffer): Observable<any> {
    createoffer.userId = this.userService.getUserId();
    createoffer.offerCreatedBy = this.userService.getUserId();
    createoffer.offerOwner = this.userService.getUserId();
    createoffer.ownerName = this.userService.getName();
    return this.httpClient.post(this.offerCreateUrl, createoffer, { withCredentials: true });
  }

  updateOffer(createoffer: CreateOffer): Observable<any> {
    createoffer.userId = this.userService.getUserId();
    createoffer.offerCreatedBy = this.userService.getUserId();
    createoffer.offerOwner = this.userService.getUserId();
    return this.httpClient.post(this.offerUpdateUrl, createoffer, { withCredentials: true });
  }

  getIdpid() {
    let url = this.environmentService.REST_API_AUTH_IDP_TOKEN_URL;
    return this.httpClient.get(url);
  }



  validateIdpid(idpidvalue) {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Authorization': header
    //   }),
    //   withCredentials: true 
    // };
    let url = this.environmentService.REST_API_IDPID_GET_URL + '/' + idpidvalue;
    return this.httpClient.get(url);


  }
  getEditOfferUpdate(obj) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true
    };
    if (this.environmentService.REST_API_UPDATE_OFFER) {
      let url = this.environmentService.REST_API_UPDATE_OFFER;
      console.log("edit offer url", url);
      return this.httpClient.post(url, obj, httpOptions);
    }
  }
  get disablePrBEList(): boolean {
    return this.disablePrimaryBEList;
  }
  set disablePrBEList(disablePBEList: boolean) {
    this.disablePrimaryBEList = disablePBEList;
  }
}
