import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import RepoBase from '../../lib/base-classes/repo-base';

const schema = new Schema(
  {
    name: {type: String, required: true},
    period: Number,
    startTime: String,
    runOnStartup: {type: Boolean, required: true},
    primary: {type: Boolean, required: true}, // only runs on primary server
    primaryServerUrl: String, // identify server running primary job

    userId: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    duration: {type: String, required: true},
    active: {type: Boolean, default: false},
    status: {type: String, required: true},
    data: Object
  },
  {collection: 'dfa_job'}
);

@injectable()
export default class JobRepo extends RepoBase {

  constructor() {
    super(schema, 'Job');
  }

}
