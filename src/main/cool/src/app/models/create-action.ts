export class CreateAction {
  offerId: string;
  caseId: string;
  actionTitle: string;
  description: string;
  mileStone: string;
  selectedFunction: string;
  assignee: Array<any>;
  dueDate: any;
  owner: string;
  offerName: string;
  actionCreator: string;
  type: string;

  constructor(
    offerId: string,
    caseId: string,
    actionTitle: string,
    description: string,
    mileStone: string,
    selectedFunction: string,
    assignee: Array<any>,
    dueDate: any,
    owner: string,
    offerName: string,
    actionCreator: string,
    type: string,
  ) {
    this.offerId = offerId;
    this.caseId = caseId;
    this.actionTitle = actionTitle;
    this.description = description;
    this.mileStone = mileStone;
    this.selectedFunction = selectedFunction;
    this.assignee = assignee;
    this.dueDate = dueDate;
    this.owner = owner;
    this.offerName = offerName;
    this.actionCreator = actionCreator;
    this.type = type;
  }
}
