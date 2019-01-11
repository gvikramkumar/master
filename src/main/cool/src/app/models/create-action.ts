export class CreateAction {
  offerId: string;
  caseId: string;
  actionTitle: string;
  description: string;
  mileStone: string;
  selectedFunction: string;
  assignee: Array<any>;
  dueDate: any;
  

  constructor(offerId: string,
    caseId: string,
    actionTitle: string,
    description: string,
    mileStone: string,
    selectedFunction: string,
    assignee: Array<any>,
    dueDate: any) {
        this.offerId = offerId;
        this.caseId=caseId;
        this.actionTitle = actionTitle;
        this.description = description;
        this.mileStone = mileStone;
        this.selectedFunction = selectedFunction;
        this.assignee = assignee;
        this.dueDate = dueDate;
  }
}
