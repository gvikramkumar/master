import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './environment';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class EnvironmentService {

    baseapi: string='';
    REST_API_MYACTIONS_URL;
    REST_API_PRIMARY_URL;
    REST_API_OFFER_CREATE_URL;
    REST_API_MMEDIT_SEARCH_URL;
    REST_API_MYOFFERS_URL;
    REST_API_MMOFFER_ATTRIBUTES_URL;
    REST_API_MMATTRIBUTES_POST_URL;
    REST_API_MM_STAKEHOLDERS_GET_URL;
    REST_API_MM_OFFER_BUILDER_GET_URL;
    REST_API_MM_STAKEHOLDERS_SEARCH_URL;
    REST_API_MM_STAKEHOLDERS_EDIT_ADD_URL;
    REST_API_DISMISS_NOTIFICATION;
    REST_API_ACCESS_MANAGEMENT_GETALL_URL;
    REST_API_ACCESS_MANAGEMENT_CREATEUSER_URL;
    REST_API_ACCESS_MANAGEMENT_UPDATEUSER_URL;
    REST_API_TURBO_TAX_MENU;
    REST_API_HOLD_OFFER;
    REST_API_CANCEL_OFFER;
    REST_API_ACTIONSTRACKER_URL;
    REST_API_ACCESS_MANAGEMENT_GETUSER_URL;

    constructor() {
        let windowUrl = location.href;
        if(windowUrl.includes('dev')) {
        this.baseapi = 'https://cool-srv-dev.cisco.com';
          this.REST_API_MYACTIONS_URL = this.baseapi+'/coolsrv/action/getMyAction/';
          this.REST_API_PRIMARY_URL = this.baseapi+'/coolsrv/primaryBusiness/';
          this.REST_API_OFFER_CREATE_URL = this.baseapi+'/coolsrv/offer/create/';
          this.REST_API_MMEDIT_SEARCH_URL = this.baseapi+'/coolsrv/collabrators/searchCollabrators';
          this.REST_API_MYOFFERS_URL = this.baseapi+'/coolsrv/offer/getMyOffers/';
          this.REST_API_MMOFFER_ATTRIBUTES_URL =  this.baseapi+'/coolsrv/getOfferDefaults?type=offerdimensions';
          this.REST_API_MMATTRIBUTES_POST_URL = this.baseapi+'/coolsrv/validateOfferDim';
          this.REST_API_MM_STAKEHOLDERS_GET_URL = this.baseapi+'/coolsrv/stakeholder/getStakeHolderMgnt/';
          this.REST_API_MM_OFFER_BUILDER_GET_URL = this.baseapi+'/coolsrv/offer/getOffersDetails/';
          this.REST_API_MM_STAKEHOLDERS_SEARCH_URL = this.baseapi+'/coolsrv/collabrators/searchCollabrators';
          this.REST_API_MM_STAKEHOLDERS_EDIT_ADD_URL = this.baseapi+'/coolsrv/offer/updateOfferDetails';
          this.REST_API_DISMISS_NOTIFICATION = this.baseapi+'/coolsrv/action/updateMyAction';
          this.REST_API_ACCESS_MANAGEMENT_GETALL_URL = this.baseapi+'/coolsrv/access/getAll';
          this.REST_API_ACCESS_MANAGEMENT_CREATEUSER_URL = this.baseapi+'/coolsrv/access/createNewUser';
          this.REST_API_ACCESS_MANAGEMENT_UPDATEUSER_URL = this.baseapi+'/coolsrv/access/updateUser';
          this.REST_API_TURBO_TAX_MENU = this.baseapi + '/coolsrv/bpmApi/getMilestones/';
          this.REST_API_HOLD_OFFER = this.baseapi + '/coolsrv/offer/hold/';
          this.REST_API_CANCEL_OFFER = this.baseapi + '/coolsrv/offer/Cancel/';
          this.REST_API_ACTIONSTRACKER_URL = this.baseapi+'/coolsrv/bpmApi/getTask/';
          this.REST_API_ACCESS_MANAGEMENT_GETUSER_URL=this.baseapi+'/coolsrv/stakeholder/getStakeHolderMgnt/MM1/All';
          console.log("EnvironmentService: set env vars for dev environment");
        } else if(windowUrl.includes('stg')) {
            this.baseapi = 'https://cool-srv-stg.cisco.com';
            this.REST_API_MYACTIONS_URL = this.baseapi+'/coolsrv/action/getMyAction/';
          this.REST_API_PRIMARY_URL = this.baseapi+'/coolsrv/primaryBusiness/';
          this.REST_API_OFFER_CREATE_URL = this.baseapi+'/coolsrv/offer/create/';
          this.REST_API_MMEDIT_SEARCH_URL = this.baseapi+'/coolsrv/collabrators/searchCollabrators';
          this.REST_API_MYOFFERS_URL = this.baseapi+'/coolsrv/offer/getMyOffers/';
          this.REST_API_MMOFFER_ATTRIBUTES_URL =  this.baseapi+'/coolsrv/getOfferDefaults?type=offerdimensions';
          this.REST_API_MMATTRIBUTES_POST_URL = this.baseapi+'/coolsrv/validateOfferDim';
          this.REST_API_MM_STAKEHOLDERS_GET_URL = this.baseapi+'/coolsrv/stakeholder/getStakeHolderMgnt/';
          this.REST_API_MM_OFFER_BUILDER_GET_URL = this.baseapi+'/coolsrv/offer/getOffersDetails/';
          this.REST_API_MM_STAKEHOLDERS_SEARCH_URL = this.baseapi+'/coolsrv/collabrators/searchCollabrators';
          this.REST_API_MM_STAKEHOLDERS_EDIT_ADD_URL = this.baseapi+'/coolsrv/offer/updateOfferDetails';
          this.REST_API_DISMISS_NOTIFICATION = this.baseapi+'/coolsrv/action/updateMyAction';
          this.REST_API_ACCESS_MANAGEMENT_GETALL_URL = this.baseapi+'/coolsrv/access/getAll';
          this.REST_API_ACCESS_MANAGEMENT_CREATEUSER_URL = this.baseapi+'/coolsrv/access/createNewUser';
          this.REST_API_ACCESS_MANAGEMENT_UPDATEUSER_URL = this.baseapi+'/coolsrv/access/updateUser';
          this.REST_API_TURBO_TAX_MENU = this.baseapi + '/coolsrv/bpmApi/getMilestones/';
          this.REST_API_HOLD_OFFER = this.baseapi + '/coolsrv/offer/hold/';
          this.REST_API_CANCEL_OFFER = this.baseapi + '/coolsrv/offer/Cancel/';
          this.REST_API_ACTIONSTRACKER_URL = this.baseapi+'/coolsrv/bpmApi/getTask/';
          this.REST_API_ACCESS_MANAGEMENT_GETUSER_URL=this.baseapi+'/coolsrv/stakeholder/getStakeHolderMgnt/MM1/All';
            console.log("EnvironmentService: set env vars for stg environment");
        } else if(windowUrl.includes('prd')) {
            this.baseapi = 'https://cool-srv-prd.cisco.com';
            this.REST_API_MYACTIONS_URL = this.baseapi+'/coolsrv/action/getMyAction/';
          this.REST_API_PRIMARY_URL = this.baseapi+'/coolsrv/primaryBusiness/';
          this.REST_API_OFFER_CREATE_URL = this.baseapi+'/coolsrv/offer/create/';
          this.REST_API_MMEDIT_SEARCH_URL = this.baseapi+'/coolsrv/collabrators/searchCollabrators';
          this.REST_API_MYOFFERS_URL = this.baseapi+'/coolsrv/offer/getMyOffers/';
          this.REST_API_MMOFFER_ATTRIBUTES_URL =  this.baseapi+'/coolsrv/getOfferDefaults?type=offerdimensions';
          this.REST_API_MMATTRIBUTES_POST_URL = this.baseapi+'/coolsrv/validateOfferDim';
          this.REST_API_MM_STAKEHOLDERS_GET_URL = this.baseapi+'/coolsrv/stakeholder/getStakeHolderMgnt/';
          this.REST_API_MM_OFFER_BUILDER_GET_URL = this.baseapi+'/coolsrv/offer/getOffersDetails/';
          this.REST_API_MM_STAKEHOLDERS_SEARCH_URL = this.baseapi+'/coolsrv/collabrators/searchCollabrators';
          this.REST_API_MM_STAKEHOLDERS_EDIT_ADD_URL = this.baseapi+'/coolsrv/offer/updateOfferDetails';
          this.REST_API_DISMISS_NOTIFICATION = this.baseapi+'/coolsrv/action/updateMyAction';
          this.REST_API_ACCESS_MANAGEMENT_GETALL_URL = this.baseapi+'/coolsrv/access/getAll';
          this.REST_API_ACCESS_MANAGEMENT_CREATEUSER_URL = this.baseapi+'/coolsrv/access/createNewUser';
          this.REST_API_ACCESS_MANAGEMENT_UPDATEUSER_URL = this.baseapi+'/coolsrv/access/updateUser';
          this.REST_API_TURBO_TAX_MENU = this.baseapi + '/coolsrv/bpmApi/getMilestones/';
          this.REST_API_HOLD_OFFER = this.baseapi + '/coolsrv/offer/hold/';
          this.REST_API_CANCEL_OFFER = this.baseapi + '/coolsrv/offer/Cancel/';
          this.REST_API_ACTIONSTRACKER_URL = this.baseapi+'/coolsrv/bpmApi/getTask/';
          this.REST_API_ACCESS_MANAGEMENT_GETUSER_URL=this.baseapi+'/coolsrv/stakeholder/getStakeHolderMgnt/MM1/All';
            console.log("EnvironmentService: set env vars for prd environment");
        } else {
            this.baseapi = 'https://cool-srv-dev.cisco.com';
            this.REST_API_MYACTIONS_URL = this.baseapi+'/coolsrv/action/getMyAction/';
          this.REST_API_PRIMARY_URL = this.baseapi+'/coolsrv/primaryBusiness/';
          this.REST_API_OFFER_CREATE_URL = this.baseapi+'/coolsrv/offer/create/';
          this.REST_API_MMEDIT_SEARCH_URL = this.baseapi+'/coolsrv/collabrators/searchCollabrators';
          this.REST_API_MYOFFERS_URL = this.baseapi+'/coolsrv/offer/getMyOffers/';
          this.REST_API_MMOFFER_ATTRIBUTES_URL =  this.baseapi+'/coolsrv/getOfferDefaults?type=offerdimensions';
          this.REST_API_MMATTRIBUTES_POST_URL = this.baseapi+'/coolsrv/validateOfferDim';
          this.REST_API_MM_STAKEHOLDERS_GET_URL = this.baseapi+'/coolsrv/stakeholder/getStakeHolderMgnt/';
          this.REST_API_MM_OFFER_BUILDER_GET_URL = this.baseapi+'/coolsrv/offer/getOffersDetails/';
          this.REST_API_MM_STAKEHOLDERS_SEARCH_URL = this.baseapi+'/coolsrv/collabrators/searchCollabrators';
          this.REST_API_MM_STAKEHOLDERS_EDIT_ADD_URL = this.baseapi+'/coolsrv/offer/updateOfferDetails';
          this.REST_API_DISMISS_NOTIFICATION = this.baseapi+'/coolsrv/action/updateMyAction';
          this.REST_API_ACCESS_MANAGEMENT_GETALL_URL = this.baseapi+'/coolsrv/access/getAll';
          this.REST_API_ACCESS_MANAGEMENT_CREATEUSER_URL = this.baseapi+'/coolsrv/access/createNewUser';
          this.REST_API_ACCESS_MANAGEMENT_UPDATEUSER_URL = this.baseapi+'/coolsrv/access/updateUser';
            this.REST_API_MYACTIONS_URL = this.baseapi+'/coolsrv/action/getMyAction/';
            this.REST_API_TURBO_TAX_MENU = this.baseapi + '/coolsrv/bpmApi/getMilestones/';
            this.REST_API_HOLD_OFFER = this.baseapi + '/coolsrv/offer/hold/';
            this.REST_API_CANCEL_OFFER = this.baseapi + '/coolsrv/offer/Cancel/';
            this.REST_API_ACTIONSTRACKER_URL = this.baseapi+'/coolsrv/bpmApi/getTask/';
            this.REST_API_ACCESS_MANAGEMENT_GETUSER_URL=this.baseapi+'/coolsrv/stakeholder/getStakeHolderMgnt/MM1/All';
            console.log("EnvironmentService: set env vars for dev environment");
        }
    }
   


}