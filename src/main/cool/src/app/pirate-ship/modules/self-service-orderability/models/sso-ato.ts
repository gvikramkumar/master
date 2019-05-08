import { SsoStatus } from './sso-status';

export interface SsoAto {

    'type': string;
    'status': string;
    'productName': string;
    'organization': string;
    'errorOrWarning': string;
    'npiTestOrderFlag': string;
    'orderabilityCheckStatus': string;

    'ssoStatusList': SsoStatus;

}
