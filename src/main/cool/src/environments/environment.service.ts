import { Injectable } from '@angular/core';

@Injectable()
export class EnvironmentService {

    ssoUrl: string;
    owbUrl: string;
    tncOwbUrl: string;
    baseApiUrl: string;
    baseIdpUrl: string;
    redirectUrl: string;
    basePdafApiUrl: string;
    authTokenBaseApiUrl: string;

    clientId: string;
    idpClientId: string;
    idpClientSecret: string;

    // EMAIL NOTIFICATION URL
    REST_API_POST_USER_DETAILS_FOR_EMAIL_URL:string;

    // CEPM URL
    REST_API_GET_CEPMROLES_URL:string;

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
    PDAF_ISVALID_EGINIE_PID: string;

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
    REST_API_SEND_DASHBOARD_NOTIFICATION_CSDL_POST_URL: string;

    // ACCESS MANAGEMENT URLs
    REST_API_CREATE_NEW_USER_URL: string;
    REST_API_UPDATE_USER_INFO_URL: string;
    REST_API_RETRIEVE_USER_INFO_URL: string;
    REST_API_ACCESS_MANAGEMENT_GET_ALL_URL: string;
    REST_API_GET_CEPM_ROLES_URL: string;

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
    REST_API_OFFER_SETUP_MODULE_GET_URL: string;
    REST_API_OFFER_PS_MODULE_GET_URL: string;
    REST_API_OFFER_MODULE_STATUS_GET_URL: string;
    REST_API_LOCK_API_FOR_OWB: string;

    // ITEM CREATION URLs
    REST_API_GET_ITEM_DETAILS: string;
    REST_API_GET_OFFER_DROPDOWN: string;
    REST_API_REMOVE_ITEM_DETAILS: string;
    REST_API_UPDATE_EGENIE_FLAG: string;

    // MODELING & DESIGN URLs
    REST_API_RETRIEVE_MODELING_ACTIVITIES_URL: string;
    REST_API_UPDATE_MODELING_DESIGN_STATUS_URL: string;

    // SERVICE ANNUITY URLs
    REST_API_RETRIEVE_SERVICE_ATO_LIST_URL: string;
    REST_API_RETRIEVE_SERVICE_ANNUITY_PRICING_URL: string;

    // TERM AND CONTENT MAPPING URLs
    REST_API_RETRIEVE_TERM_CONTENT_MAPPING_URL: string;

    // CSDL URLs
    REST_API_GET_ALL_PROJECTS: string;
    REST_API_POST_CREATE_CSDL_ASSOCIATION: string;
    REST_API_REFRESH_PROJECTS: string;
    REST_API_CSDL_INFO_GET_URL: string;
    REST_API_CSDL_PUBLISH_INFO_PUT_URL: string;

    // SERVICE FOR BASIC MODULES URLs - NPI
    REST_API_GET_ALL_COMMENTS_NPI_URL: string;
    REST_API_ADD_COMMENT_NPI_URL: string;

    // SERVICE FOR BASIC MODULES URLs - Royal Setup
    REST_API_GET_ALL_COMMENTS_ROYALTY_SETUP: string;
    REST_API_ADD_COMMENT_ROYALTY: string;

    // SERVICE FOR BASIC MODULES URLs - Offer Attribution
    REST_API_GET_ALL_COMMENTS_OFFER_ATTRIBUTION: string;
    REST_API_ADD_COMMENT_OFFER_ATTRIBUTION: string;

    // SERVICE FOR BASIC MODULES URLs - Export Compliance
    REST_API_GET_ALL_COMMENTS_EXPORT_COMPLIANCE: string;
    REST_API_ADD_COMMENT_EXPORT_COMPLIANCE: string;

    // SERVICE FOR BASIC MODULES URLs - Testing
    REST_API_GET_ALL_COMMENTS_TESTING: string;
    REST_API_ADD_COMMENT_TESTING: string;

    // SERVICE FOR BASIC MODULES URLs - Pricing Uplift
    REST_API_GET_ALL_COMMENTS_PRICING_UPLIFT: string;
    REST_API_ADD_COMMENT_PRICING_UPLIFT: string;

    // BASIC MODULE STATUS UPDATE API
    REST_API_UPDATE_MODULE_STATUS_URL: string;
    REST_API_GET_MODULE_STATUS_URL: string;

    // MARK COMPLETE STATUS URLs
    REST_API_GET_MARK_COMPLETE_STATUS_URL: string;
    REST_API_UPDATE_MARK_COMPLETE_STATUS_URL: string;

    // SELF SERVICE ORDERABILITY URLs
    REST_API_GET_SSO_DETAILS_URL: string;

    // SERVICE MAPPING URLs
    REST_API_DOWNLOAD_CONFIG_SHEET: string;
    REST_API_GET_MAPPING_STATUS: string;
    REST_CHECK_MAESTRO_PF_STATUS: string;

    // PIRATE SHIP NOTIFICATION URLs
    REST_API_PIRATE_SHIP_DASHBOARD_NOTIFICATION_URL;

    // Royalty_setup Doc upload

    REST_API_BasicModule_upload: string;
    REST_API_BasicModule_DownloadDoc: string;
    REST_API_BasicModuleFileName: string;
    REST_API_BasicModuleDocType: string;
    REST_API_ServiceAPUpdate: string;
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
                this.ssoUrl = 'https://sso.cloudapps.cisco.com/sso/index.html#/dashboard';
                this.tncOwbUrl = 'https://offer.cloudapps.cisco.com/owb/#/subscription';
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
                this.owbUrl = 'https://owb1-stage.cloudapps.cisco.com/owb';
                this.ssoUrl = 'https://sso.cloudapps.cisco.com/sso/index.html#/dashboard';
                this.tncOwbUrl = 'https://offer-stage.cloudapps.cisco.com/owb/#/subscription';
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
                this.owbUrl = 'https://owb1-stage.cloudapps.cisco.com/owb';
                this.ssoUrl = 'https://sso.cloudapps.cisco.com/sso/index.html#/dashboard';
                this.tncOwbUrl = 'https://offer-stage.cloudapps.cisco.com/owb/#/subscription';
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
                this.owbUrl = 'https://owb1-stage.cloudapps.cisco.com/owb';
                this.ssoUrl = 'https://sso.cloudapps.cisco.com/sso/index.html#/dashboard';
                this.tncOwbUrl = 'https://offer-stage.cloudapps.cisco.com/owb/#/subscription';
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
                this.owbUrl = 'https://owb1-stage.cloudapps.cisco.com/owb';
                this.ssoUrl = 'https://sso.cloudapps.cisco.com/sso/index.html#/dashboard';
                this.tncOwbUrl = 'https://offer-stage.cloudapps.cisco.com/owb/#/subscription';
        }

        //-----------------------EMAIL NOTIFICATION URL --------------------
        this.REST_API_POST_USER_DETAILS_FOR_EMAIL_URL = `${this.baseApiUrl}/accessManagement/sendAccessManagementEmail`

        //-------------------------CEPM URL------------------------------
        this.REST_API_GET_CEPMROLES_URL = `${this.baseApiUrl}/access/fetchCEPMRoles`
        
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

        this.PDAF_ISVALID_EGINIE_PID = this.basePdafApiUrl + '/product/1.0/isPIDavailable?pid=';

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
        this.REST_API_SEND_DASHBOARD_NOTIFICATION_CSDL_POST_URL = this.baseApiUrl + '/dashboard/notification/generate/';

        // ------------------------------- ACCESS MANAGEMENT URLs---------------------------------------------------

        this.REST_API_RETRIEVE_USER_INFO_URL = this.baseApiUrl + '/access/getuser';
        this.REST_API_UPDATE_USER_INFO_URL = this.baseApiUrl + '/access/updateUser';
        this.REST_API_CREATE_NEW_USER_URL = this.baseApiUrl + '/access/createNewUser';
        this.REST_API_ACCESS_MANAGEMENT_GET_ALL_URL = this.baseApiUrl + '/access/getAll';
        this.REST_API_GET_CEPM_ROLES_URL = this.baseApiUrl + '/access/fetchCEPMRoles';

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

        this.REST_API_LOCK_API_FOR_OWB = this.baseApiUrl + '/owb/lockAPI/';
        this.REST_API_OFFER_SETUP_MODULE_GET_URL = this.baseApiUrl + '/offersetup/getAllModuleStatus/';
        this.REST_API_OFFER_PS_MODULE_GET_URL = this.baseApiUrl + '/offersetup/getPSModules/';


        // --------------------------------------- ITEM CREATION --------------------------------------------

        this.REST_API_GET_OFFER_DROPDOWN = this.baseApiUrl + '/itemcreation/getATOs';
        this.REST_API_GET_ITEM_DETAILS = this.baseApiUrl + '/itemcreation/getDetails';
        this.REST_API_REMOVE_ITEM_DETAILS = this.baseApiUrl + '/itemcreation/removeATOs';
        this.REST_API_UPDATE_EGENIE_FLAG = this.baseApiUrl + '/itemcreation/getEGenieStatus';

        // ------------------------------------ MODELING & DESIGN -------------------------------------------------

        this.REST_API_RETRIEVE_MODELING_ACTIVITIES_URL = this.baseApiUrl + '/modeling/getModelingActivities';
        this.REST_API_UPDATE_MODELING_DESIGN_STATUS_URL = this.baseApiUrl + '/modeling/updateModelDesignStatus';

        // --------------------------------------- SERVICE ANNUITY  CREATION --------------------------------------------

        this.REST_API_RETRIEVE_SERVICE_ATO_LIST_URL = this.baseApiUrl + '/itemcreation/getATOs';
        this.REST_API_RETRIEVE_SERVICE_ANNUITY_PRICING_URL = this.baseApiUrl + '/serviceAnnuityPricing/getPricingOfferLevel';
        this.REST_API_ServiceAPUpdate = this.baseApiUrl + '/serviceAnnuityPricing/getPricingAtoSkusLevel';


      // --------------------------------------- TERM AND CONTENT MAPPING --------------------------------------------

        this.REST_API_RETRIEVE_TERM_CONTENT_MAPPING_URL = this.baseApiUrl + '/offersetup/getTNCMappingObject';

        // -------------------------------------- CSDL --------------------------------------------------------------------------

        this.REST_API_REFRESH_PROJECTS = this.baseApiUrl + '/csdl/getCsdlDetails';
        this.REST_API_GET_ALL_PROJECTS = this.baseApiUrl + '/csdl/searchCsdlProjectsNames';
        this.REST_API_POST_CREATE_CSDL_ASSOCIATION = this.baseApiUrl + '/csdl/saveCsdlDetails';
        this.REST_API_CSDL_INFO_GET_URL = this.baseApiUrl + '/csdl/csdlInformation/';
        this.REST_API_CSDL_PUBLISH_INFO_PUT_URL = this.baseApiUrl + '/csdl/publishCsdlData';

        // --------------------------------------- BASIC MODULES - NPI Licensing ----------------------------------------------

        this.REST_API_UPDATE_MODULE_STATUS_URL = this.baseApiUrl + '/pirateship/module';
        this.REST_API_ADD_COMMENT_NPI_URL = this.baseApiUrl + '/pirateship/module/addNPILicensingComments';
        this.REST_API_GET_ALL_COMMENTS_NPI_URL = this.baseApiUrl + '/pirateship/module/getNPILicensingComment';

        // --------------------------------------- BASIC MODULES - ROYALTY SETUP ----------------------------------------------

        this.REST_API_ADD_COMMENT_ROYALTY = this.baseApiUrl + '/pirateship/module/addRoyaltySetupComments';
        this.REST_API_GET_ALL_COMMENTS_ROYALTY_SETUP = this.baseApiUrl + '/pirateship/module/getRoyaltySetupComment';


        // --------------------------------------- BASIC MODULES - OFFER ATTRIBUTION ---------------------------------------------

        this.REST_API_ADD_COMMENT_OFFER_ATTRIBUTION = this.baseApiUrl + '/pirateship/module/addOfferAttributionComments';
        this.REST_API_GET_ALL_COMMENTS_OFFER_ATTRIBUTION = this.baseApiUrl + '/pirateship/module/getOfferAttributionComment';

        // --------------------------------------- BASIC MODULES - Export Compliance ---------------------------------------------

        this.REST_API_ADD_COMMENT_EXPORT_COMPLIANCE = this.baseApiUrl + '/pirateship/module/addExportComplianceComments';
        this.REST_API_GET_ALL_COMMENTS_EXPORT_COMPLIANCE = this.baseApiUrl + '/pirateship/module/getExportComplianceComment';

        // --------------------------------------- BASIC MODULES - Testing --------------------------------------------

        this.REST_API_ADD_COMMENT_TESTING = this.baseApiUrl + '/pirateship/module/addTestingComments';
        this.REST_API_GET_ALL_COMMENTS_TESTING = this.baseApiUrl + '/pirateship/module/getTestingComment';

        // --------------------------------------- BASIC MODULES - Pricing Uplift --------------------------------------------

        this.REST_API_ADD_COMMENT_PRICING_UPLIFT = this.baseApiUrl + '/pirateship/module/addPricingUpliftComments';
        this.REST_API_GET_ALL_COMMENTS_PRICING_UPLIFT = this.baseApiUrl + '/pirateship/module/getPricingUpliftComment';

        // --------------------------------------- BASIC MODULES - Pirateship --------------------------------------------

        this.REST_API_GET_MODULE_STATUS_URL = this.baseApiUrl + '/pirateship/module/getPirateshipModuleStatus';
        this.REST_API_UPDATE_MODULE_STATUS_URL = this.baseApiUrl + '/pirateship/module/addPirateshipModuleStatus';
        // ------------------------------------MARK COMPLETE STATUS URLs-------------------------------------------------------------------
        this.REST_API_GET_MARK_COMPLETE_STATUS_URL = this.baseApiUrl + '/offersetup/getTogglesStatus/';
        this.REST_API_UPDATE_MARK_COMPLETE_STATUS_URL = this.baseApiUrl + '/offersetup/UpdateOrAddTogglesStatus';

        // -------------------------------------- SELF SERVICE ORDERABILITY URLs --------------------------------------

        this.REST_API_GET_SSO_DETAILS_URL = this.baseApiUrl + '/orderability/retrieveSsoDetails/';

        // --------------------------------------- SERVICE MAPPING --------------------------------------------

        this.REST_API_DOWNLOAD_CONFIG_SHEET = this.baseApiUrl + '/serviceMapping/xls';
        this.REST_API_GET_MAPPING_STATUS = this.baseApiUrl + '/serviceMapping/getStatus';
        this.REST_CHECK_MAESTRO_PF_STATUS = this.baseApiUrl + '/serviceMapping/pf/status';

        // --------------------------------------- PIRATE SHIP DASHBOARD URLs --------------------------------------------

        this.REST_API_PIRATE_SHIP_DASHBOARD_NOTIFICATION_URL = this.baseApiUrl + '/dashboard/notification/generate';


        // -------------------------------------------------Basic Module DOCUMENT UPLOAD URL--------------------------------
        this.REST_API_BasicModule_upload = this.baseApiUrl + '/pirateship/BasicModule_UpLoadDoc/UpLoadDoc';
        this.REST_API_BasicModule_DownloadDoc = this.baseApiUrl + '/pirateship/BasicModule_UpLoadDoc/DownloadDoc';
        this.REST_API_BasicModuleFileName = this.baseApiUrl + '/pirateship/BasicModule_UpLoadDoc/getFileName';
        this.REST_API_BasicModuleDocType = this.baseApiUrl + '/pirateship/BasicModule_UpLoadDoc/getUploadDetail';



    }
}
