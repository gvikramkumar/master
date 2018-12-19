export class AccessManagement {
    userId: string;
    functionalRole: string;
    buList: string[];
    beList: string[];
    adminValue: boolean;
    keyPocValue: boolean;
    constructor(userId: string,
        functionalRole: string,
        buList: string[],
        beList: string[],
        adminValue: boolean,
        keyPocValue: boolean
    ) {
    this.userId = userId;
    this.functionalRole = functionalRole;
    this.buList = buList;
    this.beList = beList;
    this.adminValue = adminValue;
    this.keyPocValue = keyPocValue;
  }
}
