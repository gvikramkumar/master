import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../lib/base-classes/repo-base';

const schema = new Schema(
  {
    host: {type: String, required: true},
    jobName: {type: String, required: true},
    userId: {type: String, required: true},
    startDate: Date,
    endDate: Date,
    duration: Number,
    status: String,
    data: Object,
    error: Object
  },
  {collection: 'dfa_job_log'}
);

@injectable()
export default class JobLogRepo extends RepoBase {

  constructor() {
    super(schema, 'JobLog');
  }

}
