

/*
  {
    host: {type: String, required: true},
    jobName: {type: String, required: true},
    userId: {type: String, required: true},
    startDate: Date,
    endDate: Date,
    duration: String,
    running: {type: Boolean, required: true},
    status: String,
    data: Object,
  },

 */
import AnyObj from '../../../../shared/models/any-obj';

export class DfaJobRun {
  serverHost: string;
  jobName: string;
  userId = 'system';
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  running?: boolean;
  status?: string;
  data?: AnyObj;
  error?: AnyObj;

  constructor(data = {}) {
    Object.assign(this, data);
  }
}
