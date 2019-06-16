import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import RepoBase from '../../lib/base-classes/repo-base';

const schema = new Schema(
  {
    name: {type: String, required: true},
    period: Number,
    startTime: String,
    runOnStartup: Boolean, // we can have runOnStartup and !period/startTime, i.e. jobs that run only once on startup
    canLog: Boolean,
    active: {type: Boolean, required: true},
    primary: {type: Boolean, required: true}, // only runs on primary server
  },
  {collection: 'dfa_job_config'}
);

@injectable()
export default class JobConfigRepo extends RepoBase {

  constructor() {
    super(schema, 'JobConfig');
  }

}
