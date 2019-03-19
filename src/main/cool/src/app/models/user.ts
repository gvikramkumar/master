import { UserMapping } from './usermapping';

export class User {

    _id: string;
    userName: string;
    emailId: string;
    businessUnits: string[];
    userMappings: UserMapping;



    constructor(_id: string,
        userName: string,
        emailId: string,
        businessUnits: string[],
        userMappings: UserMapping) {
        this._id = _id;
        this.userName = userName;
        this.emailId = emailId;
        this.businessUnits = businessUnits;
        this.userMappings = userMappings;
    }


}
