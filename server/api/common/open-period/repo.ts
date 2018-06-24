import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import ModuleRepoBase from '../../../lib/base-classes/module-repo-base';


const schema = new Schema(
  {
    moduleId: {type: Number, required: true},
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
export default class OpenPeriodRepo extends ModuleRepoBase {
  constructor() {
    super(schema, 'OpenPeriod');
  }
}

