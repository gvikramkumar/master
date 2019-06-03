import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import RepoBase from '../../lib/base-classes/repo-base';

const schema = new Schema(
  {
    serverUrl: {type: String, required: true},
    name: {type: String, required: true},
    active: {type: Boolean, default: false},
    userId: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    duration: {type: String, required: true},
    status: {type: String, required: true},
    data: Object
  },
  {collection: 'dfa_job_run'}
);

@injectable()
export default class JobRepo extends RepoBase {

  constructor() {
    super(schema, 'JobRun');
  }

}
