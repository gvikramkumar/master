import AnyObj from '../../../shared/models/any-obj';


export class DfaJobLog {
  host: string;
  jobName: string;
  userId = 'system';
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  running?: boolean;
  status?: string;
  data?: AnyObj;
  error?: AnyObj;
  timestamp?: Date;

  constructor(data = {}) {
    Object.assign(this, data);
  }
}
