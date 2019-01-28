export class Groups {
    groupName: string;
    listOfferQuestions: [];
    constructor(groupName: string, listOfferQuestions) {
        this.groupName = groupName;
        this.listOfferQuestions = listOfferQuestions;
    }
}
