import {Schema} from 'mongoose';
import {injectable} from 'inversify';
import ModuleRepoBase from '../../../lib/base-classes/module-repo-base';

const schema = new Schema(
  {
    moduleId: {type: Number, required: true},
    name: {type: String, required: true, trim: true},
    period: {type: String, required: true},
    driverName: {type: String, required: true},
    salesMatch: String,
    productMatch: String,
    scmsMatch: String,
    legalEntityMatch: String,
    beMatch: String,
    sl1Select: String,
    scmsSelect: String,
    beSelect: String,
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'dfa_allocation_rule'}
);

@injectable()
export default class AllocationRuleRepo extends ModuleRepoBase {
  constructor() {
    super(schema, 'Rule');
  }

}
