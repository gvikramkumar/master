export class CreateActionApprove {
    taskId: string;
    userId: string;
    taskName: string;
    action: string;
    comment: string;
    constructor(
      taskId: string,
      userId: string,
      taskName: string,
      action: string,
      comment: string) {
          this.taskId = taskId;
          this.userId = userId;
          this.taskName = taskName;
          this.action = action;
          this.comment = comment;
    }
  }
