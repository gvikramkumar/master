export class ActionsAndNotifcations{
    offerId:string;
    actionTitle:string;
    offerName:string;
    offerOwner:string;
    assigneeId:string;
    triggerDate:string;
    dueDate:string;
    taskId:string;
    notificationTitle:string;
    alertType:number;
    styleColor:string;
    actionDesc:string;
    caseId:string;
    createdBy:string;
    defaultFunction:string;
    attachment: boolean;
    completed: boolean;
    type:string;
    completedDate:string;
    constructor() {

    }

    setCompletedDate(completedDate) {
        this.completedDate = completedDate;
    }

    getCompletedDate(){
        return this.completedDate;
    }

    setCompleted(completed) {
        this.completed = completed;
    }
    getCompleted(){
        return this.completed;
    }
    setAttachment(attachment) {
        this.attachment = attachment;
    }
    setType(type) {
        this.type = type;
    }

    setCaseId(caseId) {
        this.caseId = caseId;
    }
    setTaskId(taskId) {
        this.taskId = taskId;
    }

    getTaskId() {
        return this.taskId;
    }

    getCaseId() {
        return this.caseId;
    }

    setCreatedBy(createdBy) {
        this.createdBy = createdBy;
    }

    getCreatedBy() {
        return this.createdBy;
    }

    setStyleColor(styleColor) {
        this.styleColor = styleColor;
    }

    setActionDesc(actionDesc) {
        this.actionDesc = actionDesc;
    }

    setAlertType(alertType) {
        this.alertType = alertType;
    }
    setOfferId(offerId) {
        this.offerId = offerId;
    }

    setOfferName(offerName) {
        this.offerName = offerName;
    }

    setActionTitle(actionTitle) {
        this.actionTitle = actionTitle;
    }

    setNotificationTitle(notificationTitle) {
        this.notificationTitle = notificationTitle;
    }
    setAssigneeId(assigneeId) {
        this.assigneeId = assigneeId;
    }

    setTriggerDate(triggerDate) {
        this.triggerDate = triggerDate;
    }

    setDueDate(dueDate) {
        this.dueDate = dueDate;
    }
    setDefaultFunctione(defaultFunction) {
        this.defaultFunction = defaultFunction;
    }

    getOfferOwner(){
        return this.offerOwner;
    }

    setOfferOwner(offerOwner:string) {
        this.offerOwner = offerOwner;
    }

}