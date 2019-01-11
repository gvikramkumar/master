export class CreateActionComment {
    taskId: string;
    userId: string;
    taskName: string;
    action: string;
    comment: string;
    actionTitle: string;
    description: string;
    mileStone: string;
    selectedFunction: string;
    assignee: Array<any>;
    dueDate: string;
    constructor(
      taskId: string,
      userId: string,
      taskName: string,
      action: string,
      comment: string,
      actionTitle: string,
      description: string,
      mileStone: string,
      selectedFunction: string,
      assignee: Array<any>,
      dueDate: string) {
          this.taskId = taskId;
          this.userId = userId;
          this.taskName = taskName;
          this.action = action;
          this.comment = comment;
          this.actionTitle = actionTitle;
          this.description = description;
          this.mileStone = mileStone;
          this.selectedFunction = selectedFunction;
          this.assignee = assignee;
          this.dueDate = dueDate;
    }
  }
