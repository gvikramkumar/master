import { SsoStatus } from './sso-status';

export interface SsoAto {

    'type': string;
    'productName': string;
    'organization': string;
    'currentStatus': string;
    'errorOrWarning': string;
    'npiTestOrderFlag': string;
    'orderabilityCheckStatus': string;

    'ssoStatus': SsoStatus;

}
