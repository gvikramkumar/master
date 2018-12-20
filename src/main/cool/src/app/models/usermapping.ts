export class UserMapping {
    businessEntity: string[];
    functionalRole: string;
    functionalAdmin: Boolean = false;
    keyPOC: Boolean = false;
    constructor(businessEntity: string[],
        functionalRole: string,
        functionalAdmin: Boolean,
        keyPOC: Boolean) {
        this.businessEntity = businessEntity;
        this.functionalRole = functionalRole;
        this.functionalAdmin = functionalAdmin;
        this.keyPOC = keyPOC;
    }
}
