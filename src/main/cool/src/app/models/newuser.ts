import { UserMapping } from './usermapping';

export class NewUser {
    userId: string;
    buList: string[];
    userMapping: UserMapping[] = [];
    constructor(userId: string,
        buList: string[],
        userMapping: UserMapping[] = []
    ) {
        this.userId = userId;
        this.buList = buList;
        this.userMapping = userMapping;
    }
}
