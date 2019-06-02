import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import RepoBase from '../base-classes/repo-base';

const schema = new Schema(
  {
    jobName: {type: String, required: true},
    userId: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    duration: {type: String, required: true},
    status: {type: String, required: true},
    data: Schema.Types.Mixed
  },
  {collection: 'dfa_job_log'}
);

@injectable()
export default class JobLogRepo extends RepoBase {

  constructor() {
    super(schema, 'JobLog');
  }

}
