// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  REST_API_URL_GET_CURRENT_USER: "https://pdaf-api-stg.cisco.com/pdafapp/system/1.0/get/currentUser",
  
  //REST_API_NEW_CALL:"https://cool-srv-dev.cisco.com/coolsrvdev/userInfo",
  
  REST_API_URL:'https://pdaf-api-stg.cisco.com/pdafapp/user/1.0/getLdapUserInfo/',

  REST_API_USER_INFO_URL:'https://pdaf-api-dev.cisco.com/pdafapp/user/1.0/getLdapUserInfo',
  
  // REST_API_URL:'http://localhost:8085/cool/',
  REST_API_PRIMARY_URL:'https://cool-srv-dev.cisco.com/coolsrv/primaryBusiness/',
  
  REST_API_OFFER_CREATE_URL: 'https://cool-srv-dev.cisco.com/coolsrv/offer/create/',
  
  REST_API_PRIMARY_BUSINESS_ENTITY_URL: 'https://pdaf-api-stg.cisco.com/pdafapp/mdm/1.0/hierarchy/getBUhierarchy?business_unit=',
  
  REST_API_SECONDARY_BUSINESS_UNIT_URL: 'https://pdaf-api-stg.cisco.com/pdafapp/mdm/1.0/hierarchy/getBUhierarchy?columns=business_unit&distinct=true',


  REST_API_SECONDARY_BUSINESS_ENTITY_URL: 'https://pdaf-api-stg.cisco.com/pdafapp/mdm/1.0/hierarchy/getBUhierarchy?business_unit=',
 
 
 REST_API_MMEDIT_SEARCH_URL:'https://cool-srv-dev.cisco.com/coolsrv/collabrators/searchCollabrators',

  REST_API_MYACTIONS_URL: 'https://cool-srv-dev.cisco.com/coolsrv/action/getMyAction/',
  REST_API_MYOFFERS_URL: 'https://cool-srv-dev.cisco.com/coolsrv/offer/getMyOffers/',
  REST_API_MMOFFER_ATTRIBUTES_URL:'https://cool-srv-dev.cisco.com/coolsrv/getOfferDefaults?type=offerdimensions',
  REST_API_MMATTRIBUTES_POST_URL:'https://cool-srv-dev.cisco.com/coolsrv/validateOfferDim',
  REST_API_MM_STAKEHOLDERS_GET_URL:'https://cool-srv-dev.cisco.com/coolsrv/stakeholder/getStakeHolderMgnt/',
  REST_API_MM_OFFER_BUILDER_GET_URL:'https://cool-srv-dev.cisco.com/coolsrv/offer/getOffersDetails/',
  REST_API_MM_STAKEHOLDERS_SEARCH_URL: 'https://cool-srv-dev.cisco.com/coolsrv/collabrators/searchCollabrators',
  REST_API_MM_STAKEHOLDERS_EDIT_ADD_URL:'https://cool-srv-dev.cisco.com/coolsrv/offer/updateStakeHolderdata'
  // change with localhost:8080 in local dev
};
