import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    fiscalMonth: {type: Number, required: true},
    openFlag: {type: String, required: true},
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'dfa_open_period'}
);

@injectable()
export default class OpenPeriodRepo extends RepoBase {
  constructor() {
    super(schema, 'OpenPeriod');
  }
}

