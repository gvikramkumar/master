// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  REST_API_URL:'http://localhost:8080/cooloffer/',
  REST_API_PRIMARY_URL:'http://localhost:8080/cooloffer/primaryBusiness/',
  REST_API_OFFER_CREATE_URL: 'http://localhost:8085/cool/offer/create/',
  REST_API_SECONDARY_BUSINESS_UNIT_URL: 'http://pdaf-api.cisco.com/pdafapp/mdm/1.0/hierarchy/getBUhierarchy?columns=business_unit&distinct=true',
  REST_API_SECONDARY_BUSINESS_ENTITY_URL: 'http://pdaf-api.cisco.com/pdafapp/mdm/1.0/hierarchy/getBUhierarchy?business_unit=',
  // REST_API_MYACTIONS_URL: 'http://localhost:8085/cool/action/getMyAction/',
  //REST_API_MYOFFERS_URL: 'http://localhost:8085/cool/offer/getMyOffers/',
  REST_API_MYACTIONS_URL: 'http://10.155.72.220:8085/cool/action/getMyAction/ekuruva',
  REST_API_MYOFFERS_URL: 'http://10.155.72.220:8080/cooloffer/offer/getMyOffers/ekuruva',
  // change with localhost:8080 in local dev
};
