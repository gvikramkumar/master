export class ActionsAndNotifcations{
    offerId: string;
    actiontTitle: string;
    offerName: string;
    assigneeId: string;
    triggerDate: string;
    dueDate: string;
    taskId: string;
    notificationTitle: string;
    alertType: number;
    styleColor: string;
    actionDesc: string;
    caseId: string;
    createdBy: string;
    defaultFunction: string;
    constructor() {

    }

    setCaseId(caseId) {
        this.caseId = caseId;
    }
    setTaskId(taskId) {
        this.taskId = taskId;
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

    setActiontTitle(actiontTitle) {
        this.actiontTitle = actiontTitle;
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
}