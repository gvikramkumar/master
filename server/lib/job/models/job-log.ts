

/*
    message: String,
    timestamp: {type: Date, default: new Date()},
 */
import {DfaJobRun} from './job-run';

export class DfaJobLog extends DfaJobRun {
  message?: string;
  timestamp?: Date;

  constructor(run: DfaJobRun, message?) {
    super(run);
    this.message = message;
  }
}
