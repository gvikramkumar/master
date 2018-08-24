import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    moduleId: {type: Number, required: true},
    fiscalMonth: {type: Number, required: true},
    openFlag: {type: String, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_open_period'}
);

@injectable()
export default class OpenPeriodRepo extends RepoBase {
  constructor() {
    super(schema, 'OpenPeriod');
  }
}

