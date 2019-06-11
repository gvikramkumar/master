import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import RepoBase from '../../lib/base-classes/repo-base';

const schema = new Schema(
  {
    name: {type: String, required: true},
    active: {type: Boolean, required: true},
    period: Number,
    startTime: String,
    runOnStartup: {type: Boolean, required: true},
    primary: {type: Boolean, required: true}, // only runs on primary server
    primaryServerUrl: String, // identify server running primary job
  },
  {collection: 'dfa_job-config'}
);

@injectable()
export default class JobConfigRepo extends RepoBase {

  constructor() {
    super(schema, 'JobConfig');
  }

}
