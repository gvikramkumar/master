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
    activeStatus: {type: String, enum: ['A', 'I'], required: true},
    status: {type: String, enum: ['D', 'P', 'A', 'I'], required: true},
    approvedOnce: {type: String, enum: ['Y', 'N'], required: true},
    // we validate early in approval repos, when this isn't set yet, if we set it before validation,
    // we mess up our concurrency check, can't win then, we'll sacrifice the required=true
    submittedBy: {type: String},
    submittedDate: {type: Date},
    approvedBy: {type: String},
    approvedDate: {type: Date},
    createdBy: {type: String},
    createdDate: {type: Date},
    updatedBy: {type: String},
    updatedDate: {type: Date}
  },
  {collection: 'dfa_allocation_rule'}
);

@injectable()
export default class AllocationRuleRepo extends RepoBase {
  isModuleRepo = true;

  constructor() {
    super(schema, 'Rule');
  }

}
