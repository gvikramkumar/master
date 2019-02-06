export class CreateActionApprove {
    taskId: string;
    userId: string;
    taskName: string;
    action: string;
    comment: string;
    attachment: boolean;
    constructor(
      taskId: string,
      userId: string,
      taskName: string,
      action: string,
      comment: string,
      attachment: boolean) {
          this.taskId = taskId;
          this.userId = userId;
          this.taskName = taskName;
          this.action = action;
          this.comment = comment;
          this.attachment = attachment;
    }
  }
