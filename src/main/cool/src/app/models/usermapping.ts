export class UserMapping {

    businessEntity: string;
    functionalRole: string;
    functionalAdmin: Boolean = false;
    keyPOC: Boolean = false;
    appRoleList: string[];

    constructor(businessEntity: string,
        functionalRole: string,
        functionalAdmin: Boolean,
        keyPOC: Boolean,
        appRoleList: string[]) {
        this.businessEntity = businessEntity;
        this.functionalRole = functionalRole;
        this.functionalAdmin = functionalAdmin;
        this.keyPOC = keyPOC;
        this.appRoleList = appRoleList;
    }
}
