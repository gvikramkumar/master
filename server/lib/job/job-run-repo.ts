import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import RepoBase from '../../lib/base-classes/repo-base';

const schema = new Schema(
  {
    serverUrl: {type: String, required: true},
    jobName: {type: String, required: true},
    userId: {type: String, required: true},
    startDate: Date,
    endDate: Date,
    duration: Number,
    running: {type: Boolean, required: true},
    status: String,
    data: Object,
    error: Object
  },
  {collection: 'dfa_job_run'}
);

@injectable()
export default class JobRunRepo extends RepoBase {

  constructor() {
    super(schema, 'JobRun');
  }

}
