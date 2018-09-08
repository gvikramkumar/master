import {Schema} from 'mongoose';
import {injectable} from 'inversify';
import RepoBase from '../../../lib/base-classes/repo-base';


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
    salesCritCond: String,
    salesCritChoices: [String],
    prodPFSelect: String,
    prodPFCritCond: String,
    prodPFCritChoices: [String],
    prodBUSelect: String,
    prodBUCritCond: String,
    prodBUCritChoices: [String],
    prodTGSelect: String,
    prodTGCritCond: String,
    prodTGCritChoices: [String],
    scmsSelect: String,
    scmsCritCond: String,
    scmsCritChoices: [String],
    beSelect: String,
    beCritCond: String,
    beCritChoices: [String],
    status: {type: String, enum: ['D', 'P', 'A', 'I'], required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_allocation_rule'}
);

@injectable()
export default class AllocationRuleRepo extends RepoBase {
  constructor() {
    super(schema, 'Rule', true);
  }

}
