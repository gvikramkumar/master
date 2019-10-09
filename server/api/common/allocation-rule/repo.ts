import {Schema} from 'mongoose';
import {injectable} from 'inversify';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    moduleId: {type: Number, required: true},
    name: {type: String, required: true, trim: true},
    oldName: String,
    desc: {type: String, required: true},
    period: {type: String, required: true},
    driverName: {type: String, required: true},
    salesMatch: String,
    productMatch: String,
    scmsMatch: String,
    legalEntityMatch: String,
    beMatch: String,
    countryMatch: String,
    extTheaterMatch: String,
    glSegmentsMatch: {type: [String], enum: ['ACCOUNT', 'SUB ACCOUNT', 'COMPANY']},
    sl1Select: String,
    sl2Select: String,
    sl3Select: String,
    sl1IpCond: String,
    sl2IpCond: String,
    sl3IpCond: String,
    prodPFSelect: String,
    prodBUSelect: String,
    prodTGSelect: String,
    scmsSelect: String,
    beSelect: String,
    countrySelect:String,
    externalTheaterSelect:String,
    activeStatus: {type: String, enum: ['A', 'I'], required: true},
    status: {type: String, enum: ['D', 'P', 'A', 'I'], required: true},
    approvedOnce: {type: String, enum: ['Y', 'N'], required: true},
    // we validate early in approval repos, when this isn't set yet, if we set it before validation,
    // we mess up our concurrency check, can't win then, we'll sacrifice the required=true
    approvalReminderTime: {type: Date},
    approvalUrl: {type: String},
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
