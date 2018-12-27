export class CreateAction {
  comment: string;
  title: string;
  description: string;
  milestone: string;
  selectFunction: string;
  assignee: string;
  dueDate: string;

  constructor(comment: string,
    title: string,
    description: string,
    milestone: string,
    selectFunction: string,
    assignee: string,
    dueDate: string) {
        this.comment = comment;
        this.title = title;
        this.description = description;
        this.milestone = milestone;
        this.selectFunction = selectFunction;
        this.assignee = assignee;
        this.dueDate = dueDate;
  }
}
