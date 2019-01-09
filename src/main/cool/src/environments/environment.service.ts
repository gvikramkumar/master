import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './environment';
import 'rxjs/add/operator/toPromise';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
    REST_API_UPDATE_OFFER;
    REST_API_DISMISS_NOTIFICATION;
    REST_API_ACCESS_MANAGEMENT_GETALL_URL;
    REST_API_ACCESS_MANAGEMENT_CREATEUSER_URL;
    REST_API_ACCESS_MANAGEMENT_UPDATEUSER_URL;
    REST_API_TURBO_TAX_MENU;
    REST_API_HOLD_OFFER;
    REST_API_CANCEL_OFFER;
    REST_API_EMAIL_NORIFICATION;
    REST_API_ACTIONSTRACKER_URL;
    REST_API_ACCESS_MANAGEMENT_GETUSER_URL;
    REST_API_OFFERPHASE_DETAILS_URL;
    REST_API_STAKEHOLDERLIST_GET_URL;
    REST_API_EXITCRITERIA_REQUEST_APPROVAL_POST_URL;
    REST_API_ACCESS_MANAGEMENT_ACCESS_CHECK_URL;
    REST_API_RIGISTERNEWUSER_GET_URL;
    REST_API_GETFUNCTIONAL_ROLE_URL;
    REST_API_CREATE_NEW_ACTION_POST_URL;
    REST_API_CREATE_NEW_ACTION_GETMILESTONE_URL;
    REST_API_CREATE_NEW_ACTION_GET_FUNCTION_URL;
    REST_API_CREATE_NEW_ACTION_GET_ASSIGNEE_URL;
    
    basepdafapi: string = '';
    basepdafdevapi:string ='';

    REST_API_URL_GET_CURRENT_USER;
    REST_API_URL_GET_LDAP_INFO;
    REST_API_PRIMARY_BUSINESS_ENTITY_URL;
    REST_API_SECONDARY_BUSINESS_UNIT_URL;
    REST_API_SECONDARY_BUSINESS_ENTITY_URL;
    PDAF_API;

    USER_ID;
    PASSWORD;
    constructor() {
        this.setEnvironmentVariables();
    }
   
    private setEnvironmentVariables() {
        const windowUrl = location.href;
        let environment = 'localhost';
        if (windowUrl.includes('dev')) {
            environment = 'development';
        } else if (windowUrl.includes('stg')) {
            environment = 'stage';
        } else if (windowUrl.includes('prd')) {
            environment = 'production';
        }

        console.log(`Environment service is running on ${environment}`);

        switch (environment) {
            case 'production':
                this.baseapi = 'https://cool-srv-prd.cisco.com/coolsrv';
                this.basepdafapi = 'https://pdaf-api-prd.cisco.com/pdafapp';
                this.basepdafdevapi = 'https://pdaf-api-dev.cisco.com/pdafapp';
                break;
            case 'stage':
                this.baseapi = 'https://cool-srv-stg.cisco.com/coolsrv';
                this.basepdafapi = 'https://pdaf-api-stg.cisco.com/pdafapp';
                this.basepdafdevapi = 'https://pdaf-api-dev.cisco.com/pdafapp';
                break;
            case 'development':
               
            this.baseapi = 'https://cool-srv-dev.cisco.com/coolsrv';
            this.basepdafapi = 'https://pdaf-api-stg.cisco.com/pdafapp';
            this.basepdafdevapi = 'https://pdaf-api-dev.cisco.com/pdafapp';
                break;
            default:
                this.baseapi = '/api';
                this.basepdafapi = '/pdafapp';
                this.basepdafdevapi ='/pdafappdev';
                /**
                 * Please remove your user ID and Password before checkin
                 * this will be only used for local development
                 */
                this.USER_ID = 'lulfeng';
                this.PASSWORD = 'Wdq123321@';
        }


        this.REST_API_GETFUNCTIONAL_ROLE_URL = this.baseapi + '/LOV/getFunctionalRoles';
        this.REST_API_STAKEHOLDERLIST_GET_URL = this.baseapi + '/offer/getOffersDetails';
        this.REST_API_RIGISTERNEWUSER_GET_URL = this.baseapi + '/LOV/getFunctionalRoles';
        this.REST_API_MYACTIONS_URL = this.baseapi + '/action/getMyAction/';
        this.REST_API_PRIMARY_URL = this.baseapi + '/primaryBusiness/';
        this.REST_API_OFFER_CREATE_URL = this.baseapi + '/offer/create/';
        this.REST_API_MMEDIT_SEARCH_URL = this.baseapi + '/collabrators/searchCollabrators';
        this.REST_API_MYOFFERS_URL = this.baseapi + '/offer/getMyOffers/';
        this.REST_API_MMOFFER_ATTRIBUTES_URL = this.baseapi + '/getOfferDefaults?type=offerdimensions';
        this.REST_API_MMATTRIBUTES_POST_URL = this.baseapi + '/validateOfferDim';
        this.REST_API_MM_STAKEHOLDERS_GET_URL = this.baseapi + '/stakeholder/getStakeHolderMgnt/';
        this.REST_API_MM_OFFER_BUILDER_GET_URL = this.baseapi + '/offer/getOffersDetails/';
        this.REST_API_MM_STAKEHOLDERS_SEARCH_URL = this.baseapi + '/collabrators/searchCollabrators';
        this.REST_API_UPDATE_OFFER = this.baseapi + '/offer/updateOfferDetails';
        this.REST_API_DISMISS_NOTIFICATION = this.baseapi + '/action/proceed';
        this.REST_API_ACCESS_MANAGEMENT_GETALL_URL = this.baseapi + '/access/getAll';
        this.REST_API_ACCESS_MANAGEMENT_CREATEUSER_URL = this.baseapi + '/access/createNewUser';
        this.REST_API_ACCESS_MANAGEMENT_UPDATEUSER_URL = this.baseapi + '/access/updateUser';
        this.REST_API_MYACTIONS_URL = this.baseapi + '/action/getMyAction/';
        this.REST_API_TURBO_TAX_MENU = this.baseapi + '/bpmApi/getMilestones/';
        this.REST_API_HOLD_OFFER = this.baseapi + '/action/proceed/';
        this.REST_API_CANCEL_OFFER = this.baseapi + '/action/proceed/';
        this.REST_API_ACTIONSTRACKER_URL = this.baseapi + '/bpmApi/getTask/';
        this.REST_API_ACCESS_MANAGEMENT_GETUSER_URL = this.baseapi + '/stakeholder/getStakeHolderMgnt/MM1/All';
        this.REST_API_OFFERPHASE_DETAILS_URL = this.baseapi + '/bpmApi/getMilestones';
        this.REST_API_EXITCRITERIA_REQUEST_APPROVAL_POST_URL = this.baseapi + '/emailNotification/sendEmailNotification/';
        this.REST_API_ACCESS_MANAGEMENT_ACCESS_CHECK_URL = this.baseapi + '/access/getuser';
        this.REST_API_CREATE_NEW_ACTION_POST_URL = this.baseapi + '/action/create/manualAction';
        this.REST_API_CREATE_NEW_ACTION_GETMILESTONE_URL = this.baseapi + '/bpmApi/getMilestones';
        this.REST_API_CREATE_NEW_ACTION_GET_FUNCTION_URL = this.baseapi + '/LOV/getFunctionalRoles';
        this.REST_API_CREATE_NEW_ACTION_GET_ASSIGNEE_URL = this.baseapi + '/LOV/getAssignee/';
        this.REST_API_EMAIL_NORIFICATION = this.baseapi + '/emailNotification/send';
        this.REST_API_URL_GET_CURRENT_USER = this.basepdafapi + '/system/1.0/get/currentUser';
        this.REST_API_URL_GET_LDAP_INFO = this.basepdafdevapi + '/user/1.0/getLdapUserInfo';
        this.REST_API_PRIMARY_BUSINESS_ENTITY_URL = this.basepdafapi + '/mdm/1.0/hierarchy/getBUhierarchy?business_unit=';
        this.REST_API_SECONDARY_BUSINESS_UNIT_URL = this.basepdafapi + '/mdm/1.0/hierarchy/getBUhierarchy?columns=business_unit&distinct=true';
        this.REST_API_SECONDARY_BUSINESS_ENTITY_URL = this.basepdafapi + '/mdm/1.0/hierarchy/getBUhierarchy?business_unit=';
        this.PDAF_API = this.basepdafapi + '/mdm/1.0/hierarchy/getBUhierarchy';
    }


}