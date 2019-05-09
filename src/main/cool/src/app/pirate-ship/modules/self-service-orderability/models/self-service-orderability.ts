import { SsoAto } from './sso-ato';

export interface SelfServiceOrderability {

    'planId': string;
    'planStatus': string;

    'module': string;
    'coolOfferId': string;

    'ssoTasks': Array<SsoAto>;

}
