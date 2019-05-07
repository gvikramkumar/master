import { Injectable } from '@angular/core';

@Injectable()
export class EnvironmentService {

    owbUrl: string;
    baseApiUrl: string;
    baseIdpUrl: string;
    redirectUrl: string;
    basePdafApiUrl: string;
    authTokenBaseApiUrl: string;

    clientId: string;
    idpClientId: string;
    idpClientSecret: string;

    //  AUTHENTICATION URLs
    REST_API_AUTH_IDP_TOKEN_URL: string;
    REST_API_GENERATE_AUTH_TOKEN_URL: string;

    // USER INFO URLs 
    REST_API_LDAP_USER_DETAILS_URL: string;
    REST_API_URL_GET_CURRENT_USER_URL: string;

    // LOV URLs
    REST_API_GET_FUNCTIONAL_ROLE_URL: string;
    REST_API_REGISTER_NEW_USER_GET_URL: string;
    REST_API_CREATE_NEW_ACTION_GET_ASSIGNEE_URL: string;
    REST_API_CREATE_NEW_ACTION_GET_FUNCTION_URL: string;

    //  OWB URLs
    REST_API_OWB_CONTROLLER_URL: string;

    //  eGenie URLs
    REST_API_GET_PID_DETAILS_URL: string;
    REST_API_DOWNLOAD_ZIP_GET_URL: string;

    //  BPM URLs
    REST_API_ACTIONS_TRACKER_URL: string;
    REST_API_ACTIONS_DASHBOARD_URL: string;
    REST_API_ACTIONS_TRACKER_DETAILS_URL: string;
    REST_API_RETRIEVE_MILESTONES_URL: string;

    //  PDAF URLs
    REST_API_PRIMARY_URL: string;
    PDAF_SEARCH_EGINIE: string;

    PDAF_API: string;
    REST_API_PRIMARY_BUSINESS_UNIT_LULU_URL: string;

    REST_API_PRIMARY_BUSINESS_ENTITY_URL: string;
    REST_API_PRIMARY_BUSINESS_ENTITY_LULU_URL: string;

    REST_API_SECONDARY_BUSINESS_UNIT_LULU_URL: string;
    REST_API_SECONDARY_BUSINESS_UNIT_URL: string;

    REST_API_SECONDARY_BUSINESS_ENTITY_URL: string;

    // OFFER URL's
    REST_API_OFFER_STATUS: string;
    REST_API_OFFER_CREATE_URL: string;
    REST_API_MY_OFFERS_URL: string;
    REST_API_IDPID_GET_URL: string;
    REST_API_RETRIEVE_OFFER_DATES: string;
    REST_API_UPDATE_OFFER: string;
    REST_API_UPDATE_OFFER_TARGET_DATE: string;
    REST_API_RETRIEVE_OFFER_DETAILS_URL: string;


    // OFFER DIMENSIONS URLs

    REST_API_RETRIEVE_OFFER_DIMENSIONS_INFO_URL: string;
    REST_API_VALIDATE_OFFER_DIMENSIONS_INFO_URL: string;
    REST_API_RETRIEVE_MM_OFFER_DIMENSIONS_ATTRIBUTES_URL: string;

    //  STRATEGY REVIEW URLs
    REST_API_STRATEGY_REVIEW_GET_URL: string;

    //  OFFER SOLUTIONING URLs
    REST_API_OFFER_SOLUTIONING_POST_URL: string;
    REST_API_RETRIEVE_OFFER_SOLUTIONING_QUESTIONS: string;
    REST_API_SAVE_OR_RETRIEVE_OFFER_SOLUTIONING_ANSWERS: string;


    // OFFER CONSTRUCT URLs
    REST_API_POST_OFFER_CONSTRUCT_URL: string;
    REST_API_ADD_DETAILS_OFFER_CONSTRUCT_URL: string;

    //  STAKEHOLDER URLs
    REST_API_SEARCH_STAKEHOLDERS_URL: string;
    REST_API_RETRIEVE_DEFAULT_STAKEHOLDERS_URL: string;
    REST_API_RETRIEVE_STAKEHOLDERS_REALTED_TO_SELECTED_ATTRIBUTES_URL: string;

    //  EMAIL URLs
    REST_API_EMAIL_NOTIFICATION: string;
    REST_API_SEND_EMAIL_NOTIFICATION_POST_URL: string;

    // ACCESS MANAGEMENT URLs
    REST_API_CREATE_NEW_USER_URL: string;
    REST_API_UPDATE_USER_INFO_URL: string;
    REST_API_RETRIEVE_USER_INFO_URL: string;
    REST_API_ACCESS_MANAGEMENT_GET_ALL_URL: string;

    //   ACTION URLs
    REST_API_POST_ACTION_URL: string;
    REST_API_CREATE_COMMENT_URL: string;
    REST_API_RETRIEVE_ACTIONS_URL: string;
    REST_API_VIEW_COMMENT_GET_URL: string;
    REST_API_ACTION_PRIMARY_POC_POST_URL: string;
    REST_API_CREATE_MANUAL_ACTION_POST_URL: string;
    REST_API_NOTIFICATION_PRIMARY_POC_POST_URL: string;
    REST_API_CREATE_STRATEGY_REVIEW_TASKS: string;
    REST_API_CREATE_DESIGN_REVIEW_TASKS: string;
    REST_API_UPDATE_ESCALATION_DETAILS: string;
    // DOWNLOAD N UPLOAD URLs
    REST_API_DOWNLOAD_OFFER_DETAILS_PDF_URL: string;
    REST_API_FILE_UPLOAD_FOR_ACTION: string;
    REST_API_DOWNLOAD_FILE_FOR_ACTION: string;

    // TTM URLs
    REST_API_GET_ICC_DETAILS_URL: string;
    REST_API_LEAD_TIME_LAUNCH_DATE: string;
    REST_API_LEAD_TIME_AVERAGE_WEEKS: string;

    // DESIGN REVIEW URL's
    REST_API_DESIGN_REVIEW_GET_URL: string;

    // OFFER SETUP
    REST_API_RETRIEVE_ATO_LIST_URL: string;
    REST_API_OFFER_SETUP_MODULE_GET_URL: string;
    REST_API_OFFER_MODULE_STATUS_GET_URL: string;

    // ITEM CREATION URLs
    REST_API_GET_ITEM_DETAILS: string;
    REST_API_GET_OFFER_DROPDOWN: string;
    REST_API_REMOVE_ITEM_DETAILS: string;
    // -------------------------------------------------------------------------------------------------


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
                this.baseApiUrl = 'https://cool-srv.cisco.com/coolsrv';
                this.basePdafApiUrl = 'https://api-supplychain.cisco.com/pdafapp';
                this.authTokenBaseApiUrl = 'https://cloudsso.cisco.com';
                this.clientId = 'cool_pdaf_client';
                this.redirectUrl = 'https://cool-prd.cisco.com/cool';
                this.baseIdpUrl = 'https://idp-stage-api.cisco.com';
                this.idpClientId = 'cool-idp-nprd';
                this.idpClientSecret = 'Cool123!';
                this.owbUrl = 'https://owb.cloudapps.cisco.com/owb';
                break;
            case 'stage':
                this.baseApiUrl = 'https://cool-srv-stg.cisco.com/coolsrv';
                this.basePdafApiUrl = 'https://api-supplychain-stage.cisco.com/pdafapp';
                this.authTokenBaseApiUrl = 'https://cloudsso-test.cisco.com';
                this.clientId = 'cool_pdaf_client';
                this.redirectUrl = 'https://cool-stg.cisco.com/cool';
                this.baseIdpUrl = 'https://idp-stage-api.cisco.com';
                this.idpClientId = 'cool-idp-nprd';
                this.idpClientSecret = 'Cool123!';
                this.owbUrl = 'https://owb-stage.cloudapps.cisco.com/owb';
                break;
            case 'qualityassurance':
                this.baseApiUrl = 'https://cool-srv-qa.cisco.com/coolsrv';
                this.basePdafApiUrl = 'https://api-supplychain-dev.cisco.com/pdafapp';
                this.authTokenBaseApiUrl = 'https://cloudsso-test.cisco.com';
                this.clientId = 'cool_pdaf_client';
                this.redirectUrl = 'https://cool-qa.cisco.com/cool';
                this.baseIdpUrl = 'https://idp-stage-api.cisco.com';
                this.idpClientId = 'cool-idp-nprd';
                this.idpClientSecret = 'Cool123!';
                this.owbUrl = 'https://owb-stage.cloudapps.cisco.com/owb';
                break;
            case 'development':
                this.baseApiUrl = 'https://cool-srv-dev.cisco.com/coolsrv';
                this.basePdafApiUrl = 'https://api-supplychain-dev.cisco.com/pdafapp';
                this.authTokenBaseApiUrl = 'https://cloudsso-test.cisco.com';
                this.clientId = 'cool_pdaf_client';
                this.redirectUrl = 'https://cool-dev.cisco.com/cool';
                this.baseIdpUrl = 'https://idp-stage-api.cisco.com';
                this.idpClientId = 'cool-idp-nprd';
                this.idpClientSecret = 'Cool123!';
                this.owbUrl = 'https://owb-stage.cloudapps.cisco.com/owb';
                break;
            default:
                this.baseApiUrl = '/api';
                this.basePdafApiUrl = '/pdafapp';
                this.authTokenBaseApiUrl = 'https://cloudsso-test.cisco.com';
                this.clientId = 'cool_pdaf_client';
                this.redirectUrl = 'http://localhost.cisco.com:4200';
                this.baseIdpUrl = '/idp';
                this.idpClientId = 'cool-idp-nprd';
                this.idpClientSecret = 'Cool123!';
                this.owbUrl = 'https://owb-stage.cloudapps.cisco.com/owb';
        }

        // ----------------------- AUTHENTICATION URLs -----------------------------------------------

        // tslint:disable-next-line: max-line-length
        this.REST_API_GENERATE_AUTH_TOKEN_URL = `${this.authTokenBaseApiUrl}/as/authorization.oauth2?client_id=${this.clientId}&response_type=token&redirect_uri=${this.redirectUrl}`;
        // tslint:disable-next-line: max-line-length
        this.REST_API_AUTH_IDP_TOKEN_URL = `${this.authTokenBaseApiUrl}/as/token.oauth2?client_id=${this.idpClientId}&client_secret=${this.idpClientSecret}&grant_type=client_credentials`;

        // ------------------------- USER INFO URLs -------------------------------------------------

        this.REST_API_LDAP_USER_DETAILS_URL = this.basePdafApiUrl + '/user/1.0/getLdapUserInfo';
        this.REST_API_URL_GET_CURRENT_USER_URL = this.basePdafApiUrl + '/system/1.1/get/currentUser';

        // ------------------------- LOV URLs---------------------------------------------------------

        this.REST_API_GET_FUNCTIONAL_ROLE_URL = this.baseApiUrl + '/LOV/getFunctionalRoles';
        this.REST_API_REGISTER_NEW_USER_GET_URL = this.baseApiUrl + '/LOV/getFunctionalRoles';
        this.REST_API_CREATE_NEW_ACTION_GET_ASSIGNEE_URL = this.baseApiUrl + '/LOV/getAssignee/';
        this.REST_API_CREATE_NEW_ACTION_GET_FUNCTION_URL = this.baseApiUrl + '/LOV/getFunctionalRoles';

        // ------------------------ OWB URLs ------------------------------------------------------

        this.REST_API_OWB_CONTROLLER_URL = this.baseApiUrl + '/owb/create';

        // ------------------------ eGenie URLs ------------------------------------------------------

        this.REST_API_DOWNLOAD_ZIP_GET_URL = this.baseApiUrl + '/eGenie/zip/';
        this.REST_API_GET_PID_DETAILS_URL = this.baseApiUrl + '/eGenie/getAttribute/';

        // ------------------------------- BPM URLs ---------------------------------------------------

        this.REST_API_ACTIONS_TRACKER_URL = this.baseApiUrl + '/bpmApi/getTasksForActionTracker/';
        this.REST_API_ACTIONS_DASHBOARD_URL = this.baseApiUrl + '/bpmApi/getTask/dashboard/';
        this.REST_API_ACTIONS_TRACKER_DETAILS_URL = this.baseApiUrl + '/bpmApi/getInfo/task';
        this.REST_API_RETRIEVE_MILESTONES_URL = this.baseApiUrl + '/bpmApi/getMilestones';

        // ------------------------- PDAF URLs ---------------------------------------------------------

        this.REST_API_PRIMARY_URL = this.baseApiUrl + '/primaryBusiness/';
        this.PDAF_SEARCH_EGINIE = this.basePdafApiUrl + '/product/1.0/getPIDsdata?item_name=';

        this.PDAF_API = this.basePdafApiUrl + '/mdm/1.0/hierarchy/getBUhierarchy';
        this.REST_API_PRIMARY_BUSINESS_UNIT_LULU_URL = this.basePdafApiUrl + '/mdm/1.0/hierarchy/getBUhierarchy?be=';

        this.REST_API_PRIMARY_BUSINESS_ENTITY_URL = this.basePdafApiUrl + '/mdm/1.0/hierarchy/getBUhierarchy?business_unit=';
        this.REST_API_PRIMARY_BUSINESS_ENTITY_LULU_URL = this.basePdafApiUrl + '/mdm/1.0/hierarchy/getBUhierarchy?columns=BE&distinct=true';

        this.REST_API_SECONDARY_BUSINESS_UNIT_LULU_URL = this.basePdafApiUrl
            + '/mdm/1.0/hierarchy/getBUhierarchy?columns=business_unit&distinct=true';
        this.REST_API_SECONDARY_BUSINESS_UNIT_URL = this.basePdafApiUrl
            + '/mdm/1.0/hierarchy/getBUhierarchy?columns=business_unit&distinct=true';

        this.REST_API_SECONDARY_BUSINESS_ENTITY_URL = this.basePdafApiUrl + '/mdm/1.0/hierarchy/getBUhierarchy?business_unit=';

        // --------------------------------OFFER URL's------------------------------------------------------------

        this.REST_API_OFFER_STATUS = this.baseApiUrl + '/offer/flags/';
        this.REST_API_OFFER_CREATE_URL = this.baseApiUrl + '/offer/create/';
        this.REST_API_MY_OFFERS_URL = this.baseApiUrl + '/offer/getMyOffers/';
        this.REST_API_IDPID_GET_URL = this.baseApiUrl + '/offer/productOffers';
        this.REST_API_RETRIEVE_OFFER_DATES = this.baseApiUrl + '/offer/getDates/';
        this.REST_API_UPDATE_OFFER = this.baseApiUrl + '/offer/updateOfferDetails';
        this.REST_API_UPDATE_OFFER_TARGET_DATE = this.baseApiUrl + '/offer/updateDates';
        this.REST_API_RETRIEVE_OFFER_DETAILS_URL = this.baseApiUrl + '/offer/getOffersDetails/';

        // ----------------------------- OFFER DIMENSION URLs---------------------------------------------------

        this.REST_API_VALIDATE_OFFER_DIMENSIONS_INFO_URL = this.baseApiUrl + '/validateOfferDim';
        this.REST_API_RETRIEVE_OFFER_DIMENSIONS_INFO_URL = this.baseApiUrl + '/offer/offerDimensions/';
        this.REST_API_RETRIEVE_MM_OFFER_DIMENSIONS_ATTRIBUTES_URL = this.baseApiUrl + '/getOfferDefaults?type=offerdimensions';

        // --------------------------------- STRATEGY REVIEW URLs ----------------------------------------------

        this.REST_API_STRATEGY_REVIEW_GET_URL = this.baseApiUrl + '/strateReview/getInfo/';

        // -------------------------- OFFER SOLUTIONING URLs -------------------------------------------------

        this.REST_API_OFFER_SOLUTIONING_POST_URL = this.baseApiUrl + '/setOfferSolution';
        this.REST_API_SAVE_OR_RETRIEVE_OFFER_SOLUTIONING_ANSWERS = this.baseApiUrl + '/solutioning/';
        this.REST_API_RETRIEVE_OFFER_SOLUTIONING_QUESTIONS = this.baseApiUrl + '/getOfferSolutioningQuestions?offerID=';

        // -------------------------- OFFER CONSTRUCT URLs ------------------------------------------------------

        this.REST_API_POST_OFFER_CONSTRUCT_URL = this.baseApiUrl + '/setOfferConstruct';
        this.REST_API_ADD_DETAILS_OFFER_CONSTRUCT_URL = this.baseApiUrl + '/setOfferConstructAttribute';

        // ------------------------ STAKEHOLDER URLs --------------------------------------------------------------

        this.REST_API_SEARCH_STAKEHOLDERS_URL = this.baseApiUrl + '/collabrators/searchCollabrators';
        this.REST_API_RETRIEVE_DEFAULT_STAKEHOLDERS_URL = this.baseApiUrl + '/stakeholder/getStakeHolderMgnt/';
        this.REST_API_RETRIEVE_STAKEHOLDERS_REALTED_TO_SELECTED_ATTRIBUTES_URL = this.baseApiUrl + '/stakeholder/getStakeHolders/';

        // ------------------------------- EMAIL URLs --------------------------------------------------------------

        this.REST_API_EMAIL_NOTIFICATION = this.baseApiUrl + '/emailNotification/send';
        this.REST_API_SEND_EMAIL_NOTIFICATION_POST_URL = this.baseApiUrl + '/emailNotification/sendEmailNotification/';

        // ------------------------------- ACCESS MANAGEMENT URLs---------------------------------------------------

        this.REST_API_RETRIEVE_USER_INFO_URL = this.baseApiUrl + '/access/getuser';
        this.REST_API_UPDATE_USER_INFO_URL = this.baseApiUrl + '/access/updateUser';
        this.REST_API_CREATE_NEW_USER_URL = this.baseApiUrl + '/access/createNewUser';
        this.REST_API_ACCESS_MANAGEMENT_GET_ALL_URL = this.baseApiUrl + '/access/getAll';

        // ---------------------------------  ACTION URLs -----------------------------------------------------------

        this.REST_API_POST_ACTION_URL = this.baseApiUrl + '/action/proceed';
        this.REST_API_VIEW_COMMENT_GET_URL = this.baseApiUrl + '/action/getComment';
        this.REST_API_CREATE_COMMENT_URL = this.baseApiUrl + '/action/createComment';
        this.REST_API_RETRIEVE_ACTIONS_URL = this.baseApiUrl + '/action/getMyAction/';
        this.REST_API_CREATE_MANUAL_ACTION_POST_URL = this.baseApiUrl + '/action/create/task/manualAction';
        this.REST_API_CREATE_STRATEGY_REVIEW_TASKS = this.baseApiUrl + '/action/create/tasks/strategyReviewTasks/';
        this.REST_API_CREATE_DESIGN_REVIEW_TASKS = this.baseApiUrl + '/action/create/tasks/designReviewTasks/'
        this.REST_API_ACTION_PRIMARY_POC_POST_URL = this.baseApiUrl + '/action/create/task/solutioningTask/action';
        this.REST_API_NOTIFICATION_PRIMARY_POC_POST_URL = this.baseApiUrl + '/action/create/task/solutioningTask/notification';
        this.REST_API_UPDATE_ESCALATION_DETAILS = this.baseApiUrl + '/action/task/escalate';
        // ------------------------- DOWNLOAD N UPLOAD URLs ----------------------------------------------

        this.REST_API_FILE_UPLOAD_FOR_ACTION = this.baseApiUrl + '/upload/file';
        this.REST_API_DOWNLOAD_FILE_FOR_ACTION = this.baseApiUrl + '/download/provideDetails';
        this.REST_API_DOWNLOAD_OFFER_DETAILS_PDF_URL = this.baseApiUrl + '/pdf/offerDetailsPDF';

        // ------------------------------- TTM URLs -------------------------------------------------------

        this.REST_API_GET_ICC_DETAILS_URL = this.baseApiUrl + '/ICC/getICC';
        this.REST_API_LEAD_TIME_LAUNCH_DATE = this.baseApiUrl + '/leadTimeCal/getLTC/';
        this.REST_API_LEAD_TIME_AVERAGE_WEEKS = this.baseApiUrl + '/leadTimeCal/ttm/getLTC/';

        // --------------------------------- DESIGN REVIEW URLs ----------------------------------------------

        this.REST_API_DESIGN_REVIEW_GET_URL = this.baseApiUrl + '/designReview/getInfo/';

        // ------------------------------------ OFFER SETUP -------------------------------------------------

        this.REST_API_RETRIEVE_ATO_LIST_URL = this.baseApiUrl + '/offersetup/getOWBModelObject/';
        this.REST_API_OFFER_SETUP_MODULE_GET_URL = this.baseApiUrl + '/offersetup/getAllModuleStatus?mmval=';
        this.REST_API_OFFER_MODULE_STATUS_GET_URL = this.baseApiUrl + '/offersetup/getModuleStatus?moduleName=';

        // --------------------------------------- ITEM CREATION --------------------------------------------

        this.REST_API_GET_OFFER_DROPDOWN = this.baseApiUrl + '/itemcreation/getATOs';
        this.REST_API_GET_ITEM_DETAILS = this.baseApiUrl + '/itemcreation/getDetails';
        this.REST_API_REMOVE_ITEM_DETAILS = this.baseApiUrl + '/itemcreation/removeATOs';  
        
        // -------------------------------------------------------------------------------------------------

    }
}
