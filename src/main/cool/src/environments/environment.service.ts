import { Injectable } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class EnvironmentService {

    baseapi = '';
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
    REST_API_EXITCRITERIA_REQUEST_ACTION_AUTO_CREATION_URL;
    REST_API_ACCESS_MANAGEMENT_ACCESS_CHECK_URL;
    REST_API_RIGISTERNEWUSER_GET_URL;
    REST_API_GETFUNCTIONAL_ROLE_URL;
    REST_API_CREATE_NEW_ACTION_POST_URL;
    REST_API_CREATE_NEW_ACTION_GETMILESTONE_URL;
    REST_API_CREATE_NEW_ACTION_GET_FUNCTION_URL;
    REST_API_CREATE_NEW_ACTION_GET_ASSIGNEE_URL;
    REST_API_CREATE_BPM_APPROVAL_URL;
    REST_APT_MMPAGE_RETRIVE_DATA_GET_URL;
    REST_API_STRATEGY_REVIEW_GET_URL;
    REST_API_VIEW_COMMENT_GET_URL;
    REST_API_CREATE_COMMENT_URL;
    REST_API_DASH_DIFF_APPROVE_URL;
    REST_API_DASH_DIFF_APPROVE_COMMENT_URL;
    REST_API_ESCALATE_NOTIFICATION_URL;
    REST_API_IDPID_GET_URL;
    REST_API_DOWNLOAD_PDF_GET_URL;
    REST_API_DOWNLOAD_ZIP_GET_URL;
    REST_API_ADD_DETAILS_OFFER_CONSTRUCT_URL;
    REST_API_OFFER_SOLUTIONING_POST_URL;
    REST_API_SEND_EMAIL_NOTIFICATION_POST_URL;
    REST_API_NOTIFICATION_PRIMARYPOC_POST_URL;
    REST_API_ACTION_PRIMARYPOC_POST_URL;
    REST_API_SET_OFFERCONSTRUCT_POST_URL;

    basepdafapi = '';

    REST_API_URL_GET_CURRENT_USER;
    REST_API_URL_GET_LDAP_INFO;
    REST_API_PRIMARY_BUSINESS_ENTITY_URL;
    REST_API_PRIMARY_BUSINESS_ENTITY_LULU_URL;
    REST_API_PRIMARY_BUSINESS_UNIT_LULU_URL;
    REST_API_SECONDARY_BUSINESS_UNIT_URL;
    REST_API_SECONDARY_BUSINESS_UNIT_LULU_URL;
    REST_API_SECONDARY_BUSINESS_ENTITY_URL;
    PDAF_API;
    PDAF_GET_TOKEN_API;
    PDAF_SEARCH_EGINIE;
    REST_API_LEAD_TIME_LAUNCH_DATE;
    REST_API_LEAD_TIME_AVERAGE_WEEKS;
    REST_API_FILE_UPLOAD_FOR_ACTION;
    REST_API_FILE_DOWNLOAD_FOR_ACTION;
    REST_API_POST_RULE_RESULT_URL;
    REST_API_GET_RULE_RESULT_URL;
    REST_API_OWB_CONTROLLER;
    REST_API_USER_DETAILS;
    REST_API_UPDATE_OFFER_TARGET_DATE;

    authtokenbaseapi = '';
    client_id;
    redirect_url;
    GENERATE_AUTH_TOKEN_URL;
    GENERATE_AUTH_IDP_TOKEN_URL;
    idpclientid;
    idpclientsecret;
    baseidpurl: string;


    constructor() {
        this.setEnvironmentVariables();
    }

    private setEnvironmentVariables() {
        const windowUrl = location.href;
        let environment = 'localhost';
        if (windowUrl.includes('dev')) {
            environment = 'development';
        } else if (windowUrl.includes('qa')) {
            environment = 'qualityassurance';
        } else if (windowUrl.includes('stg')) {
            environment = 'stage';
        } else if (windowUrl.includes('prd')) {
            environment = 'production';
        }

        switch (environment) {
            case 'production':
                this.baseapi = 'https://cool-srv-prd.cisco.com/coolsrv';
                this.basepdafapi = 'https://api-supplychain.cisco.com/pdafapp';
                this.authtokenbaseapi = 'https://cloudsso.cisco.com';
                this.client_id = 'cool_pdaf_client';
                this.redirect_url = 'https://cool-prd.cisco.com/cool';
                this.baseidpurl = 'https://idp-prd-api.cisco.com';
                this.idpclientid = 'cool-idp-nprd';
                this.idpclientsecret = 'Cool123!';
                break;
            case 'stage':
                this.baseapi = 'https://cool-srv-stg.cisco.com/coolsrv';
                this.basepdafapi = 'https://api-supplychain-dev.cisco.com/pdafapp';
                this.authtokenbaseapi = 'https://cloudsso-test.cisco.com';
                this.client_id = 'cool_pdaf_client';
                this.redirect_url = 'https://cool-stg.cisco.com/cool';
                this.baseidpurl = 'https://idp-stage-api.cisco.com';
                this.idpclientid = 'cool-idp-nprd';
                this.idpclientsecret = 'Cool123!';
                break;
            case 'qualityassurance':
                this.baseapi = 'https://cool-srv-qa.cisco.com/coolsrv';
                this.basepdafapi = 'https://api-supplychain-dev.cisco.com/pdafapp';
                this.authtokenbaseapi = 'https://cloudsso-test.cisco.com';
                this.client_id = 'cool_pdaf_client';
                this.redirect_url = 'https://cool-qa.cisco.com/cool';
                this.baseidpurl = 'https://idp-stage-api.cisco.com';
                this.idpclientid = 'cool-idp-nprd';
                this.idpclientsecret = 'Cool123!';
                break;
            case 'development':
                this.baseapi = 'https://cool-srv-dev.cisco.com/coolsrv';
                this.basepdafapi = 'https://api-supplychain-dev.cisco.com/pdafapp';
                this.authtokenbaseapi = 'https://cloudsso-test.cisco.com';
                this.client_id = 'cool_pdaf_client';
                this.redirect_url = 'https://cool-dev.cisco.com/cool';
                this.baseidpurl = 'https://idp-stage-api.cisco.com';
                this.idpclientid = 'cool-idp-nprd';
                this.idpclientsecret = 'Cool123!';
                break;
            default:
                this.baseapi = '/api';
                this.basepdafapi = '/pdafapp';
                this.authtokenbaseapi = 'https://cloudsso-test.cisco.com';
                this.client_id = 'cool_pdaf_client';
                this.redirect_url = 'http://localhost.cisco.com:4200';
                this.baseidpurl = '/idp';
                this.idpclientid = 'cool-idp-nprd';
                this.idpclientsecret = 'Cool123!';
        }

        this.GENERATE_AUTH_TOKEN_URL = `${this.authtokenbaseapi}/as/authorization.oauth2?client_id=${this.client_id}&response_type=token&redirect_uri=${this.redirect_url}`;
        this.GENERATE_AUTH_IDP_TOKEN_URL = `${this.authtokenbaseapi}/as/token.oauth2?client_id=${this.idpclientid}&client_secret=${this.idpclientsecret}&grant_type=client_credentials`;
        //this.REST_API_IDPID_GET_URL = `${this.baseidpurl}/gravity/spring/board/product_offers/cards`;
        /** PDAF API's */

        this.REST_API_URL_GET_CURRENT_USER = this.basepdafapi + '/system/1.1/get/currentUser';
        this.REST_API_URL_GET_LDAP_INFO = this.basepdafapi + '/user/1.0/getLdapUserInfo';
        this.REST_API_PRIMARY_BUSINESS_ENTITY_URL = this.basepdafapi + '/mdm/1.0/hierarchy/getBUhierarchy?business_unit=';
        this.REST_API_PRIMARY_BUSINESS_ENTITY_LULU_URL = this.basepdafapi + '/mdm/1.0/hierarchy/getBUhierarchy?columns=BE&distinct=true';
        this.REST_API_PRIMARY_BUSINESS_UNIT_LULU_URL = this.basepdafapi + '/mdm/1.0/hierarchy/getBUhierarchy?be=';
        this.REST_API_SECONDARY_BUSINESS_UNIT_LULU_URL = this.basepdafapi + '/mdm/1.0/hierarchy/getBUhierarchy?columns=business_unit&distinct=true';
        this.REST_API_SECONDARY_BUSINESS_UNIT_URL = this.basepdafapi + '/mdm/1.0/hierarchy/getBUhierarchy?columns=business_unit&distinct=true';
        this.REST_API_SECONDARY_BUSINESS_ENTITY_URL = this.basepdafapi + '/mdm/1.0/hierarchy/getBUhierarchy?business_unit=';
        this.PDAF_API = this.basepdafapi + '/mdm/1.0/hierarchy/getBUhierarchy';
        this.PDAF_SEARCH_EGINIE = this.basepdafapi + '/product/1.0/getPIDsdata?item_name=';
        /** COOL SRV API"S */

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
        this.REST_API_EXITCRITERIA_REQUEST_ACTION_AUTO_CREATION_URL = this.baseapi + '/action/create/task/';
        this.REST_API_ACCESS_MANAGEMENT_ACCESS_CHECK_URL = this.baseapi + '/access/getuser';
        this.REST_API_CREATE_NEW_ACTION_POST_URL = this.baseapi + '/action/create/manualAction';
        this.REST_API_CREATE_NEW_ACTION_GETMILESTONE_URL = this.baseapi + '/bpmApi/getMilestones';
        this.REST_API_CREATE_NEW_ACTION_GET_FUNCTION_URL = this.baseapi + '/LOV/getFunctionalRoles';
        this.REST_API_CREATE_NEW_ACTION_GET_ASSIGNEE_URL = this.baseapi + '/LOV/getAssignee/';
        this.REST_API_CREATE_BPM_APPROVAL_URL = this.baseapi + '/action/proceed';
        this.REST_API_EMAIL_NORIFICATION = this.baseapi + '/emailNotification/send';
        this.REST_APT_MMPAGE_RETRIVE_DATA_GET_URL = this.baseapi + '/offer/getOffersDetails/';
        this.REST_API_STRATEGY_REVIEW_GET_URL = this.baseapi + '/strateReview/getInfo/';
        this.REST_API_VIEW_COMMENT_GET_URL = this.baseapi + '/action/getComment';
        this.REST_API_CREATE_COMMENT_URL = this.baseapi + '/action/createComment';
        this.REST_API_DASH_DIFF_APPROVE_URL = this.baseapi + '/action/create/manualAction';
        this.REST_API_DASH_DIFF_APPROVE_COMMENT_URL = this.baseapi + '/action/proceed';
        this.REST_API_ESCALATE_NOTIFICATION_URL = this.baseapi + '/emailNotification/send';
        this.REST_API_DOWNLOAD_PDF_GET_URL = this.baseapi + '/pdf/offerDetailsPDF';
        this.REST_API_DOWNLOAD_ZIP_GET_URL = this.baseapi + '/eGenie/zip/';
        this.REST_API_ADD_DETAILS_OFFER_CONSTRUCT_URL = this.baseapi + '/setOfferConstructAttribute';
        this.REST_API_OFFER_SOLUTIONING_POST_URL = this.baseapi + '/setOfferSolution';
        this.REST_API_IDPID_GET_URL = this.baseapi + '/offer/productOffers';
        this.REST_API_SEND_EMAIL_NOTIFICATION_POST_URL = this.baseapi + '/emailNotification/sendEmailNotification/';
        this.REST_API_LEAD_TIME_AVERAGE_WEEKS = this.baseapi + '/leadTimeCal/getLTC/';
        this.REST_API_LEAD_TIME_LAUNCH_DATE = this.baseapi + '/leadTimeCal/getLTC/';
        this.REST_API_NOTIFICATION_PRIMARYPOC_POST_URL = this.baseapi + '/action/create/user/solutioningTask/notification';
        this.REST_API_ACTION_PRIMARYPOC_POST_URL = this.baseapi + '/action/create/user/solutioningTask/action';
        this.REST_API_SET_OFFERCONSTRUCT_POST_URL = this.baseapi + '/setOfferConstruct';
        this.REST_API_FILE_UPLOAD_FOR_ACTION = this.baseapi + '/upload/file';
        this.REST_API_FILE_DOWNLOAD_FOR_ACTION = this.baseapi + '/download/provideDetails';
        this.REST_API_POST_RULE_RESULT_URL = this.baseapi + '/offer/offerDimensions';
        this.REST_API_GET_RULE_RESULT_URL = this.baseapi + '/offer/offerDimensions/';
        this.REST_API_OWB_CONTROLLER = this.baseapi + '/owb/create';
        this.REST_API_USER_DETAILS = this.basepdafapi + '/user/1.0/getLdapUserInfo';
        this.REST_API_UPDATE_OFFER_TARGET_DATE = this.baseapi + '/offer/updateDates';
    }
}
