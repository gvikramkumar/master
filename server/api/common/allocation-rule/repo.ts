import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';
import {injectable} from 'inversify';

const schema = new Schema(
  {
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
export default class AllocationRuleRepo extends RepoBase {
  constructor() {
    super(schema, 'Rule');
  }

}
