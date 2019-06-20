import { SsoStatus } from './sso-status';

export interface SsoAto {

    itemType?: string;
    itemName: string;

    organization?: string;
    currentStatus?: string;

    errorOrWarning?: string;
    npiTestOrderFlag?: string;
    orderabilityCheckStatus: string;

    ssoStatus?: SsoStatus;

}
