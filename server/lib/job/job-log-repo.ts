import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import RepoBase from '../base-classes/repo-base';

const schema = new Schema(
  {
    serverUrl: {type: String, required: true},
    jobName: {type: String, required: true},
    userId: {type: String, required: true},
    message: String,
    status: String,
    data: Object,
    timestamp: {type: Date, default: new Date()},
  },
  {collection: 'dfa_job_log'}
);

@injectable()
export default class JobLogRepo extends RepoBase {

  constructor() {
    super(schema, 'JobLog');
  }

}
