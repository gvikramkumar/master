export class CreateAction {
  offername: string;
  comment: string;
  title: string;
  description: string;
  milestone: string;
  selectFunction: string;
  assignee: string;
  dueDate: string;

  constructor(offername: string,
    comment: string,
    title: string,
    description: string,
    milestone: string,
    selectFunction: string,
    assignee: string,
    dueDate: string) {
        this.offername = offername;
        this.comment = comment;
        this.title = title;
        this.description = description;
        this.milestone = milestone;
        this.selectFunction = selectFunction;
        this.assignee = assignee;
        this.dueDate = dueDate;
  }
}
