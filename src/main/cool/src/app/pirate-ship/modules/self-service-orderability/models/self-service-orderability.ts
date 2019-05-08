import { SsoAto } from './sso-ato';

export interface SelfServiceOrderability {

    'action': string;
    'module': string;

    'planId': string;
    'planStatus': string;

    'requestId': string;
    'coolOfferId': string;

    'tasks': Array<SsoAto>;

}
