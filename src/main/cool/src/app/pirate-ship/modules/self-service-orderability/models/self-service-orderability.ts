import { SsoAto } from './sso-ato';

export interface SelfServiceOrderability {


    'owbPlanId': string;

    'requestId': string;

    'coolOfferId': string;

    'data': Array<SsoAto>;

}
